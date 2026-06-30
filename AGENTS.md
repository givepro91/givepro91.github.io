# Keunsik Works — 프로젝트 지침

장근식(@givepro91, jay@spacewalk.tech)의 공개 포트폴리오 + CV. Astro 정적 사이트, 라이브 <https://givepro91.github.io>. 단일 SoT는 `src/data/cv.ts` + `src/config.ts`.

## ⚠️ 정체성: 백엔드 엔지니어로 단정하지 말 것

이 레포의 코드·git 이력은 백엔드 중심이라 근식님을 "백엔드 엔지니어"로 오인하기 쉽다. **아니다.** 현재 정체성:

- **직책**: `Technical Product Lead | PropTech × AI` (명함 기준). 포트폴리오 공개 브랜딩은 `AX Product · Engineering Lead`.
- **서사**: 10년차 백엔드를 **토대로**, 현업의 반복 판단·운영 흐름을 AI 에이전트·운영 자동화·데이터 신뢰성·human-in-the-loop 구조로 바꾸는 **AX(AI Transformation) 리드**로 역할을 넓혀왔다. 백엔드를 버린 게 아니라 **기반으로 둔 확장**이다.
- **한 줄 메시지**: "AI를 붙이는 개발자가 아니라, AI가 안전하게 일할 수 있는 운영 구조를 설계하는 사람." (생성과 검증의 분리 · 승인 게이트 · 운영을 내부 제품으로)

**피해야 할 표현**(SoT 명시): "풀스택이 됐다", "AI로 다 한다", "자동화로 사람을 대체한다", 기술 스택만 나열하는 백엔드 일변도 자기소개.

## 정체성·포지셔닝의 Source of Truth

근식님의 "현재"는 별도 레포가 정본으로 기록·갱신한다. **직무/이력/정체성 관련 작업은 추측하지 말고 이 레포의 최신 `strategy/` 를 먼저 확인한다.**

- **`jay-swk/social-portfolio-os`** (GitHub private, 현재 계정 `givepro91`로 접근 가능) — "Jay Social & Portfolio OS". 매주 Codex 자동화가 실제 업무·커밋 기반으로 포지셔닝을 갱신.
- 읽는 법: `gh api 'repos/jay-swk/social-portfolio-os/contents/<path>' --jq .content | base64 -d`
- 핵심 파일:
  - `strategy/profile-copy.md` — 헤드라인·About·한 줄 소개 카피
  - `strategy/github-derived-positioning.md` — 최신 포지셔닝 + 반복할 키워드 + 피할 표현
  - `strategy/profile-analysis.md`, `strategy/resume-refresh.md` — 강점 서사·이력서 갱신 방향
  - `portfolio/project-cards.md` — 공개 프로젝트 카드(이 사이트 Work와 대응)
  - `sources/profile-snapshot.md` — 기준 자료 요약

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
