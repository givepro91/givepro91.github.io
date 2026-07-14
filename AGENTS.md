# Keunsik Works — 프로젝트 지침

장근식(@givepro91, jay@spacewalk.tech)의 공개 포트폴리오 + CV. Astro 정적 사이트, 라이브 <https://givepro91.github.io>. 단일 SoT는 `src/data/cv.ts` + `src/config.ts`.

## ⚠️ 정체성: 백엔드 엔지니어로 단정하지 말 것

이 레포의 코드·git 이력은 백엔드 중심이라 근식님을 "백엔드 엔지니어"로 오인하기 쉽다. **아니다.** 현재 정체성:

- **직책**: `Technical Product Lead | PropTech × AI` (명함 기준). 포트폴리오 공개 브랜딩은 `AX Product · Engineering Lead`.
- **서사**: 10년차 백엔드를 **토대로**, 현업의 반복 판단·운영 흐름을 AI 에이전트·운영 자동화·데이터 신뢰성·human-in-the-loop 구조로 바꾸는 **AX(AI Transformation) 리드**로 역할을 넓혀왔다. 백엔드를 버린 게 아니라 **기반으로 둔 확장**이다.
- **한 줄 메시지**: "AI를 붙이는 개발자가 아니라, AI가 안전하게 일할 수 있는 운영 구조를 설계하는 사람." (생성과 검증의 분리 · 승인 게이트 · 운영을 내부 제품으로)

**피해야 할 표현**(SoT 명시): "풀스택이 됐다", "AI로 다 한다", "자동화로 사람을 대체한다", 기술 스택만 나열하는 백엔드 일변도 자기소개.

## 정체성·포지셔닝의 Source of Truth

근식님의 "현재"는 추측하지 말고 **`givepro91/my-wiki` 하나만 상위 SoT로 확인한다.** 사실·판단·프로젝트 계보와 공개 포지셔닝·소셜 운영을 이 저장소에 통합했다. 기존 `jay-swk/social-portfolio-os`는 2026-07-10 이관된 레거시이므로 최신 권위로 사용하지 않는다.

장근식 개인 단일 SoT (**private**). 핵심 facet이 "누구이고 왜"의 근거이고, `writing/social/`은 그 근거를 "어떻게 말할까"로 바꾸는 파생 레이어다.

- 읽는 법: `gh api 'repos/givepro91/my-wiki/contents/<path>' --jq .content | base64 -d` (또는 clone 후 read)
- 핵심 파일:
  - `me.md` — 8특질·가치 3축·기질·동력/그림자 (⚠️ `status: inferred` = 본인 확인 전)
  - `timeline.md` — 2016~2026 연대기·기술 진화 축
  - `values/*.md` — 왜 그렇게 판단했나(포기한 대안 포함)
  - `skills/ax-philosophy.md` — AX 세계관(공개 서사의 지적 뿌리)
  - `work/*.md` — 프로젝트별 판단·증거(proof·nova·miriva 등)
  - `writing/social/positioning/*.md` — 프로필·이력서·채널 표현 전략. 날짜와 핵심 facet 정합성을 확인한 뒤 사용
  - `writing/social/weekly/*.md` — 최신 주간 활동·학습·글감
  - `writing/social/state.md` — 주간 자동화의 현재 상태

### ⚠️ 공개 경계 (my-wiki=private → 이 사이트=public)

my-wiki엔 민감정보(생일·전화·연봉·인사평가·비공개 타겟)가 있다. **맥락·근거로만 읽고, 공개 CV/카드에 그대로 옮기지 않는다.**

- my-wiki 규칙: `public: true` 명시된 것만 공개 투영 대상. 그 외 전부 private.
- 표현·공개 판단은 `writing/social/` + 아래 "공개 범위(disclosure)" + 빌드 게이트(`check-disclosure`)를 따른다.
- `status: inferred` 항목은 **미검증 초안** — 공개 문구의 사실 근거로 삼지 말 것.

## 공개 범위(disclosure)

공개 이력서/포폴이다. SoT의 정책을 따른다 — 회사 내부 정보·고객명·비공개 수치·비공개 내부 서비스명은 공개 카드/CV에 넣지 않는다. home 공개 Work 카드와 1:1 대응되는 근거만 사용.

## 작업 환경 (세부는 `README.md` 정본)

스택·개발 명령·콘텐츠 편집 위치·배포 흐름의 **정본은 `README.md`** — 여기서 중복 기술하지 않는다(드리프트 방지). 요지만:

- Astro 정적 사이트, pkg 매니저는 **pnpm**. `pnpm dev`(localhost:4321) · `pnpm build` · `pnpm preview`.
- 데이터 SoT: CV = `src/data/cv.ts` / 사이트 설정 = `src/config.ts` / Work 카드 = `src/content/projects/ko/<slug>.md` / Lab = `src/data/lab.ts`.
- 배포: `main` push → GitHub Actions(`.github/workflows/deploy.yml`) → GitHub Pages(`givepro91.github.io`, USER 루트라 `base` 없음).

## 운영 규칙 (에이전트)

- **빌드 게이트는 blocking.** `pnpm build` 는 `astro build` 전후로 `scripts/check-disclosure.mjs`(source·dist)를 돌려 시크릿 패턴을 스캔한다. 게이트 실패 = 배포 불가이므로 우회(`build:nogate`)로 덮지 말고 원인을 고친다. commit 입구에도 `.githooks/pre-commit` 으로 동일 스캔이 걸린다.
- **레포 위생 — `git add .` / `git add -A` 금지.** 항상 명시 경로만 스테이징하고, add 전 `git status` 로 무엇이 잡히는지 확인한다. 커밋·푸시는 사용자가 요청할 때만.
- **스크린샷·캡쳐는 레포 밖/ignore 경로로.** throwaway 캡쳐는 `/tmp` 또는 gitignore된 경로에 둔다. 레포 루트 `*.png` 는 gitignore되지만 흩뿌리지 않는다. `.omc/` `.playwright-mcp/` 도 ignore 대상.
- **핸드오프**: 세션 인계는 `docs/handoff/<branch>.md` 에 기록·갱신한다. 작업 시작 전 해당 파일을 읽고 현재 코드와 어긋났는지 확인한 뒤 "Next steps" 부터 이어간다.
- **이력·포폴 사실 검증 (2026-07-13 학습).** 이력서·포트폴리오·프로필의 사실 주장(스택·성과·커밋 수·역할)은 커밋·코드로 검증한 뒤에만 쓴다. 증명 안 되는 주장이나, 프로젝트 전체 특징을 본인 기여로 뭉뚱그리는 표현은 뺀다. (사례: 랜드북을 "MSA 설계"로 오인, 랜드북에 없는 Kafka/Redis, Realty의 atomic swap을 본인 성과로 서술 — 모두 커밋 실측으로 정정.)
