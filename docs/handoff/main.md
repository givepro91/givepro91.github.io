---
branch: main
status: active
updated: 2026-06-30T06:18:28Z
---
## Restore in 30s
**(이번 세션) ① 프로젝트 지침 정리 + ② CV "두 축 전면 재구조" 구현·검증·UI폴리시 — 커밋·배포 완료(라이브 반영 확인).** 커밋 `c3738d6`(지침) + `97ac867`(CV재구조). GitHub Actions Deploy success, `givepro91.github.io/cv` 에 subtitle 반영·옛 직책 0건 확인.

폴리시 라운드들(사용자 로컬 육안 피드백, 전부 반영·검증):
1. 히어로 부제 색 `--ink-mute`→`--ink-sub`(흐림 해소). 히어로 하드코딩 한줄카피→"조직 전체가 AI와 안전하게 일하는 운영 구조"(`SITE.tagline`은 미사용 dead라 index.astro 직접).
2. /cv Overview ①/②를 각자 문단+파란 라벨·좌측 액센트(`.cv-axis`)로 분리.
3. /cv Career highlights를 ①/② **그룹 헤더**(`groupHighlights()`+`.cv-axis-group`/`.cv-axis-head`)로 묶음 — 각 줄 중복 ①② 접두 제거, 한눈에 두 축.
4. 이력서 PDF mini 경력 페이지 쪼개짐 → `.r-mini-group`+`break-inside:avoid`로 통째 유지(p3 상단 모임).
5. 스페이스워크 요약 run-on/"—"(AI말투) 제거 → 2문장으로 축약("…역할을 넓혔습니다. 지금은 두 축으로 일합니다."), 색 `.cv-entry-summary` `--ink-sub`→`--ink`. (하이라이트 "라벨—설명" em-dash는 사용자 결정으로 유지.)
6. **PDF에도 ①/② 그룹 헤더** 추가(`cv/print.astro`에 동일 `groupHighlights()`+`.r-axis-head`) — 요약 축약으로 PDF에서 ①/②가 미설명되던 문제 해소, 웹/PDF 구조 일치.
7. CEO 「퇴직 확인 및 인재 추천서」(사용자 로컬 PDF) 검토 — 이력서 ①축(LLM-Wiki·접근/시크릿 권한·90%+ 인프라 로컬이전·이중화·전사 레버리지)을 CEO가 독립 검증, ②축을 "풀스택 역할"로 명시. 사실 보정: `duration` 3년 5개월→**3년 6개월**(추천서 정본). 재직상태는 사용자 결정으로 "재직 중" 유지. 퇴직·권고사직 맥락은 민감정보라 공개 사이트 비노출(메모리 `project-spacewalk-departure`에 기록).
8. **AI 말투(이질감) 전체 정리** — 사용자가 "사용하는 게 이질감" 피드백. cv.json 요약·HIGHLIGHTS(7)·경력(8)·CASES 제목/화살표·VISION 헤드라인에서 수사적 tell(엠대시 연결·"A 아니라 B" 남발·화살표 체인·≠) 제거→자연 문장. **보존**: 실제 파이프라인 화살표(web→server→worker)·인용 설계원칙(Nova/Realty)·홈 브랜드 1줄. de-slop으로 PDF 5쪽 됐다가 `cv/print.astro` @media print 간격 압축으로 **4쪽 복구**.
9. **portfolio/print de-slop(부분)** — 사용자가 포폴 반영 여부 확인. 제목·부제·경력summary는 이미 반영(공유). 포폴 자체 카피는 "X가 아니라 Y" 판단 소바이트가 정체성이라 보존하고, **수사적 화살표만** 3곳 정리(why-foot "문제 정의 → 판단 → 운영 안전장치" 체인, "수 분→수 초", "동기→비동기"). 보존: 브랜드 "문제 → 판단 → 증명"·다이어그램 화살표·0→1·인용 원칙·"아니라" 18개. 포폴 PDF 10쪽 유지.
재빌드 PASS·이력서 PDF 4쪽 유지 매 라운드 확인.

①은 **완료**: `CLAUDE.md` 없어서 만들지 묻길래 — 이미 같은 역할의 `AGENTS.md`가 있어 별도 생성 시 드리프트라 판단 → AGENTS.md에 운영규칙 보강 후 `CLAUDE.md → AGENTS.md` 심링크로 단일 SoT 유지. 불필요한 `NOVA-STATE.md` 삭제.

②는 **구현·검증 완료**: Josh(조성현) 이직 자문(=`http://josh-dev:8889/resume-jang.html` + 슬랙)을 정체성 SoT(`jay-swk/social-portfolio-os/strategy`)·현재 사이트와 대조. 핵심 갭 = ① AI Operations & Agent Infrastructure(회사 차원 거버넌스·인프라·비용)가 스페이스워크 경력에 한 줄도 없었음 → 신설. 스펙=`docs/superpowers/specs/2026-06-30-cv-two-axis-reframe-design.md` 대로 8파일 편집. **빌드 PASS(16p)·disclosure 게이트 통과, 이력서 PDF 4쪽 유지(헤드라인·①/② 구조 렌더 육안 확인), 절대금액·연봉·"90%"·옛 직책 잔존 0건 grep 검증.**

직전 핸드오프 "AI 말투 정리"는 이미 커밋됨(`9e949bf`) — 해소.

## Next steps
- **커밋 결정 대기.** 사용자 OK 시 명시경로만(`git add .` 금지):
  `git add src/config.ts src/data/cv.json src/pages/index.astro src/pages/cv/index.astro src/pages/cv/print.astro src/pages/portfolio/print.astro src/styles/global.css AGENTS.md CLAUDE.md docs/superpowers docs/handoff/main.md`
  - ⚠️ 지침정리(①)와 CV재구조(②)는 성격이 달라 **커밋 2개로 분리** 권장.
- 파킹: **②축 증거(retail.plannext.ai 데모·planreviewer 캡쳐) = 자료 미확보** → 들어오면 ②에 추가(스펙 비목표에 명시). 직전 핸드오프 미결 카피건("결정 로그" 라벨·"A가 아니라 B" 구문)은 별건.
- 배포 후 카카오톡 OG 캐시는 별개(기존 작업).

## Touch points
- `docs/superpowers/specs/2026-06-30-cv-two-axis-reframe-design.md` — ②의 정본 스펙(확정 문구·변경표·검증).
- `src/config.ts:16-21` — SITE.title="Technical Product Lead" + subtitle 신규 + tagline. `src/data/cv.json` PROFILE.subtitle 신규 + CAREER[0] ①4→②3→팀리딩 8줄.
- `AGENTS.md` (=`CLAUDE.md` 심링크). 검증: `readlink CLAUDE.md` → `AGENTS.md`
- 재검증: `pnpm build 2>&1 | tail -3` → PASS. 옛 직책 0건: `grep -rl "AX Product" dist/` → 없음.
- PDF 페이지수: dist 서빙 후 headless Chrome `--print-to-pdf` → `pdfinfo` → cv/print 4p.
- 현재 미커밋: `git status --short` → M 9개 + `?? CLAUDE.md` `?? docs/superpowers/`

## Decisions
- CLAUDE.md = AGENTS.md 심링크(단일 SoT, 드리프트 0). 별도 파일 생성 거부.
- CV 범위 = 두 축 전면 재구조. 헤드라인 = TPL + ①축 부제(SoT 정본 직책 + Josh 차별점).
- 공개 수위 = 구체적으로 쓰되 **실제 절대 금액만 비노출**(비율·상용 기술명 OK, 내부 코드네임 일반화). SoT 공개정책 준수.
- ②축 라벨 = "AI Full-Stack Product Engineering" 유지하되 본문은 "끝까지 제품화"로(SoT 피할표현 "풀스택 됐다" 회피).
- 정체성 정본 = social-portfolio-os/strategy. 직무 작업 전 항상 먼저 확인(추측 금지) — 이번에 준수.
