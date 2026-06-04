# Grant Works

장근식(Jay)의 공개 포트폴리오 겸 작업 기록. **무엇을 만들었나보다, 왜 그렇게 판단했나를 기록합니다.**

> `grant-works`는 사이트 브랜드명입니다. 배포 repo는 **`givepro91.github.io`**(givepro91 계정의 USER 루트 페이지)이며, `grant`는 계정 아이디 `givepro` → *give* → **grant**(내어주다)에서 왔습니다.

## 스택

- [Astro](https://astro.build) (정적, Content Collections)
- 디자인 "The Ledger": Fraunces · Gowun Batang · Spline Sans Mono, 따뜻한 종이 ↔ 잉크 토글
- GitHub Pages 배포 (`.github/workflows/deploy.yml`)

## 개발

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # disclosure 게이트(source) → astro build → 게이트(dist)
pnpm preview
```

## 콘텐츠 편집 (라인업 조정)

대표작·실험은 모두 마크다운 파일입니다. 쉽게 조정할 수 있습니다.

- **대표작 추가/수정**: `src/content/projects/ko/<slug>.md` (스키마는 `src/content.config.ts`)
  - 정렬: frontmatter `order` 숫자
  - `kind: work | side`, `theme: backend|agentops|reliability|proptech|devtools`
  - 5필드: `positioning · shows[] · angle · decisionLog[]` + 서사 `problem/role/decision/result/learning`
- **실험 추가/수정**: `src/content/lab/ko/<slug>.md`
- **Work ↔ Lab 이동**: 파일을 해당 디렉토리로 옮기면 됩니다.

## 공개 범위 정책

회사(Spacewalk) 작업물은 **역할·문제·판단 기준을 그대로** 적되, **고객 정보 · 비공개 수치 · 시크릿(키·webhook·인프라 비밀)** 은 제외합니다.

- `scripts/check-disclosure.mjs` 가 빌드 전·후와 commit 입구(`.githooks/pre-commit`)에서 시크릿 패턴을 스캔합니다. (회사명은 스캔하지 않습니다 — 노출 허용)
- `visibility: public` 카드만 `link` 를 노출합니다. 비공개·`secret-locked` 는 서사만 둡니다.
- 게이트 통과는 "알려진 시크릿 패턴 부재"일 뿐, 누출 부재의 증명이 아닙니다 — 카드별 Risk Check 가 필수입니다.

## 배포

`main` push 시 GitHub Actions가 빌드·게이트·배포합니다. USER 루트 페이지라 `base` 설정이 없습니다(도메인 = `https://givepro91.github.io`).
i18n: 콘텐츠는 `ko/` 디렉토리 분기로 영어 확장 준비만 돼 있습니다(v1은 한국어 단일).
