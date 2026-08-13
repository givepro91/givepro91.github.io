# /interview — 비밀번호로 여는 면접 준비 페이지 (설계)

- 날짜: 2026-08-13
- 상태: 승인됨 (구현 계획 대기)

## 목적

이력서 기반 면접 질문(CS · 직무 적합도 · 조직 적합도)에 대한 답변을 한곳에 모아두고, 본인만 열어볼 수 있게 한다. 공개할 의도는 없다.

## 전제 — 왜 단순 비밀번호 게이트가 아닌가

이 레포(`givepro91/givepro91.github.io`)와 배포 사이트는 **둘 다 PUBLIC**이고, GitHub Pages는 정적 호스팅이라 서버 측 인증이 없다. 따라서 페이지에 비밀번호 입력창만 다는 방식은 보호가 아니다 — 비밀번호는 소스에, 내용은 `dist/`에 평문으로 남고 둘 다 GitHub에서 그대로 읽힌다.

또한 담을 내용이 CLAUDE.md의 공개 경계에 걸린다. 직무 적합도에는 회사 내부 구현 디테일이, 조직 적합도에는 개인 판단이 들어간다.

→ **내용을 실제로 암호화한다.** 공개 저장소에는 암호문만 올리고, 복호화는 비밀번호를 아는 사람의 브라우저에서만 일어난다.

## 결정 사항 (사용자 확정)

| 항목 | 결정 |
|---|---|
| 배치·보호 | 공개 사이트 `/interview` + 실제 암호화 |
| 내용 민감도 상한 | 회사 내부 기술 디테일까지 담되, **퇴직 사유·인사평가·연봉은 제외** |
| 사용 방식 | 질문/답 토글 + `모두 펼치기` |
| 원문 보관 | 레포 안 gitignore 경로 |

## 아키텍처

### 배제한 대안

| 방식 | 배제 사유 |
|---|---|
| CI(Actions)에서 암호화 | 원문이 공개 레포에 평문으로 존재해야 함 |
| 암호문을 레포 밖에 두고 배포 시 주입 | GitHub Pages는 레포 내용만 배포함 |

### 채택: 로컬 사전 암호화

```
private/interview/*.md            평문 원문. gitignore. 커밋되지 않음
        │
        │  pnpm interview:seal     비밀번호는 실행 시 입력, 저장하지 않음
        ▼
src/data/interview.sealed.json    salt · iv · 암호문. 이것만 커밋
        │
        │  astro build             암호문을 페이지에 인라인
        ▼
   /interview                      비밀번호 입력 → 브라우저에서 복호화 → 렌더
```

원문은 어느 단계에서도 git에 들어가지 않는다. 비밀번호는 어느 파일에도, CI에도 들어가지 않는다.

## 구성 요소

### 1. 봉인 스크립트 — `scripts/seal-interview.mjs`

Node 내장 `crypto`만 사용한다.

**입력**: `private/interview/*.md` (파일명 순서대로 섹션)
**출력**: `src/data/interview.sealed.json`

동작 순서:

1. **안전 확인**: `git ls-files private/` 결과가 비어 있지 않으면 즉시 에러 종료 (원문이 추적되고 있다는 뜻)
2. 원문 파싱 → 콘텐츠 JSON 생성
3. 비밀번호를 화면에 표시하지 않고 입력받음. 두 번 입력받아 일치 확인
4. 암호화 → `interview.sealed.json` 기록
5. **자체 검증**: 방금 쓴 파일을 같은 비밀번호로 복호화해 원본 JSON과 일치하는지 확인. 불일치면 에러

**암호 파라미터**

- 키 유도: PBKDF2-HMAC-SHA256, salt 16바이트 랜덤, 반복 310,000회, 키 길이 32바이트
- 암호화: AES-256-GCM, IV 12바이트 랜덤
- 저장 시 `ciphertext || authTag` 로 이어붙인다 (Web Crypto가 기대하는 형태)

**출력 파일 형식**

```json
{
  "v": 1,
  "kdf": { "name": "PBKDF2", "hash": "SHA-256", "iter": 310000, "salt": "<base64>" },
  "iv": "<base64>",
  "ct": "<base64>"
}
```

키 이름은 `salt` · `iv` · `ct` 만 쓴다. `password` · `secret` · `key` · `token` 을 키 이름으로 쓰면 `check-disclosure.mjs`의 자격증명 패턴(`/\b(password|passwd|secret|api[_-]?key|access[_-]?token|bearer)\b\s*[:=]\s*["'][^"'\s]{8,}["']/i`)에 그대로 걸려 빌드가 막힌다.

### 2. 원문 포맷 — `private/interview/`

파일 하나가 섹션 하나. 파일명 앞의 숫자가 정렬 순서, frontmatter `title`이 탭 이름이 된다.

```markdown
---
title: CS
---

## 서킷브레이커와 재시도는 뭐가 다른가요?
tags: 안정성, realty

재시도는 요청 하나를 다시 보내는 것이고, 서킷브레이커는 요청 자체를 멈추는 판단입니다.

- 꼬리질문: half-open은요? → 배치라서 다음 스케줄 실행이 곧 재시도입니다
```

파싱 규칙:

- `## ` 로 시작하는 줄 = 질문. 다음 `## ` 전까지가 답
- 답의 첫 줄이 `tags:` 로 시작하면 쉼표로 끊어 태그로 쓰고 본문에서 제외
- 나머지는 최소 마크다운 → HTML 변환: 문단, `- ` 목록, `**굵게**`, `` `코드` ``, `> 인용`, `### 소제목`
- 변환 전에 HTML 특수문자를 이스케이프한다

초기 섹션 3개: `10-cs.md` · `20-role-fit.md` · `30-org-fit.md`

**콘텐츠 JSON 형태**

```json
{
  "sections": [
    { "id": "cs", "title": "CS",
      "items": [{ "q": "...", "a": "<p>...</p>", "tags": ["안정성"] }] }
  ]
}
```

### 3. 페이지 — `src/pages/interview.astro`

`BaseLayout`을 쓰지 않는다. GA 추적·OG 카드·사이트맵 링크가 전부 딸려오기 때문이다. 페이지 안에 최소 레이아웃을 직접 둔다.

- `<meta name="robots" content="noindex, nofollow">`
- 전역 CSS(`src/styles/global.css`)를 페이지에서 직접 import 한다. 웹폰트는 불러오지 않고 전역 CSS의 기본 폰트를 쓴다
- 암호문은 `<script type="application/json">` 블록으로 인라인
- 잠금 화면: 비밀번호 입력칸 + 버튼. 실패 시 "비밀번호가 틀렸습니다"
- 키 유도에 310,000회 반복이 들어가 모바일에서 0.5~1초가 걸린다. 그동안 버튼을 비활성화하고 "여는 중" 상태를 표시한다
- 해제 후: 섹션 탭 · 질문 목록(기본 접힘) · `모두 펼치기` / `모두 접기` · 키워드 검색(질문·답·태그 대상)
- 비밀번호는 `sessionStorage`에 보관. 탭이 살아있는 동안 새로고침해도 다시 묻지 않고, 탭을 닫으면 사라진다. 저장된 비밀번호로 복호화가 실패하면 지우고 잠금 화면으로 되돌린다
- 복호화된 답 HTML은 `innerHTML`로 주입한다. 내용은 본인이 작성하고 본인 비밀번호로 봉인한 것이므로 신뢰 경계 안이다
- 스타일은 사이트 전역 CSS를 재사용하되, 이 페이지 전용 규칙은 페이지 안에 둔다

### 4. 노출 차단

- `astro.config.ts` — `sitemap({ filter: (page) => !page.includes("/interview") })`
- 사이트 어느 페이지에서도 `/interview`로 링크하지 않는다

**robots.txt는 만들지 않는다.** `Disallow: /interview` 를 적으면 그 파일이 누구에게나 공개되므로, 숨기려는 경로를 오히려 광고하게 된다. 색인 차단은 `noindex` 메타로 충분하고, 어디서도 링크하지 않으므로 크롤러가 도달할 경로 자체가 없다.

### 5. 빌드 게이트 정합

- `.gitignore` 에 `private/` 추가
- `scripts/check-disclosure.mjs` 의 `SKIP_DIR` 에 `"private"` 추가 — gitignore된 원문은 배포에 포함되지 않으므로 스캔 대상이 아니다. 이 항목이 없으면 로컬 `pnpm build` 가 원문을 훑는다
- `package.json` 에 `"interview:seal": "node scripts/seal-interview.mjs"` 추가

## 에러 처리

| 상황 | 처리 |
|---|---|
| 원문이 git에 추적됨 | 봉인 중단, 무엇이 추적 중인지 출력 |
| 두 번 입력한 비밀번호 불일치 | 봉인 중단 |
| 봉인 직후 자체 검증 실패 | 봉인 중단, 출력 파일 삭제 |
| 브라우저에서 비밀번호 틀림 | AES-GCM 복호화 실패 → 안내 문구 표시, 입력칸 유지 |
| `sessionStorage` 비밀번호가 더 이상 안 맞음 | 지우고 잠금 화면으로 복귀 |
| 암호문 파일 없음/손상 | "봉인 데이터를 읽을 수 없습니다" 표시 |
| 구형 브라우저에 `crypto.subtle` 없음 | 안내 문구 표시. 대체 구현은 두지 않음 |

## 검증

1. 봉인 스크립트 자체 검증 통과 (암호화 → 복호화 → 원본 일치)
2. 틀린 비밀번호로 복호화 시 실패
3. `pnpm build` — 소스·dist 게이트 모두 PASS
4. `dist/` 안에 평문 질문 문자열이 **0건**인지 grep으로 확인
5. `dist/sitemap-*.xml` 에 `/interview` 없음
6. 브라우저에서 잠금 → 해제 → 탭 전환 → 검색 → 모두 펼치기 동작 확인

## 만들지 않는 것

진도 저장 · 오답 노트 · 랜덤 출제 · 다중 사용자 · 섹션별 분할 암호화 · 비밀번호 재설정 흐름.

## 남는 위험

암호문은 공개 레포에 영구히 남는다. 비밀번호가 유출되면 그 시점까지 봉인한 내용이 전부 열리고, git 히스토리에 남은 과거 암호문도 같은 비밀번호면 함께 열린다.

- 비밀번호는 4단어 이상으로 길게 잡고, 다른 곳에 쓰는 비밀번호를 재사용하지 않는다
- 유출이 의심되면 비밀번호를 바꿔 재봉인한다. 과거 암호문까지 지우려면 git 히스토리에서 해당 파일을 제거해야 한다
- 이 설계는 알고리즘과 파라미터가 공개되어도 안전한 구조다. 안전성은 오직 비밀번호의 강도에서 나온다

## 후속 (별도 단계)

구조가 서고 나면 콘텐츠 초안을 채운다. CS는 이력서에 실제 등장하는 스택 기준, 직무 적합도는 프로젝트별(Realty · PlanReview · Landbook · Nova · MIRIVA), 조직 적합도는 my-wiki의 가치 축과 일하는 방식 기준. 퇴직 사유 · 인사평가 · 연봉은 넣지 않는다.

## 영향 받는 파일

| 파일 | 변경 |
|---|---|
| `private/interview/*.md` | 신규 (gitignore) |
| `scripts/seal-interview.mjs` | 신규 |
| `src/data/interview.sealed.json` | 신규 (생성물, 커밋 대상) |
| `src/pages/interview.astro` | 신규 |
| `.gitignore` | `private/` 추가 |
| `scripts/check-disclosure.mjs` | `SKIP_DIR` 에 `private` 추가 |
| `astro.config.ts` | sitemap filter 추가 |
| `package.json` | `interview:seal` 스크립트 추가 |
