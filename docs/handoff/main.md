---
branch: main
status: active
updated: 2026-07-13T07:33:30Z
---
## 2026-07-13 — 나니아랩스 인터뷰 준비 + Landbook 이력 과장 정정 (커밋 실측 기반·배포 완료)

### Restore in 30s
나니아랩스(Narnia Labs) AI Product Engineer 1차 인터뷰 준비자료를 `my-wiki/writing/interviews/`에 만들고, **커밋 실측으로 이력 과장 3건을 잡아 공개 CV/포폴까지 정정·배포 완료.**
1. **Nova v1/v2 구분** — "Nova=단일 에이전트 품질" 틀림. v1(`TeamSPWK/nova`, 회사, 오케스트레이션+품질 5기둥 doer)·v2(`givepro91/nova`, 개인, keeper 재설계). 멀티 에이전트 오케스트레이션은 Crewdeck. 근거: 두 레포 README + `givepro91/nova/docs/positioning.md`.
2. **Landbook "MSA 설계" 과장** — 커밋 실측(jay-swk) 결과 모든 서비스 레포가 합류(2023) 전 생성(auth 2020-07·premium 2021-10·payment 2022-02·api-gw 2020-06·garo 2020-11 최다·build 2019-09). → "이미 MSA인 환경에 합류해 개발·운영, garo 최다 기여". "설계" 아님.
3. **⚠️ Landbook Kafka/Redis·수치 과장** — auth/payment/premium `build.gradle`에 **Kafka·Redis 의존성 0**(WebFlux/Coroutine만). "Kafka로 무거운 작업 격리"·"Redis 캐시/Rate Limit"·"대규모 알림 수 분→수 초"는 **근거 없어 삭제**. 검증된 것(WebFlux·Coroutine 비동기 + 매물 배치알림 병렬처리 blocking→non-blocking)만 유지. **Kafka/Redis는 PlanNext.AI에서만 진짜**(plannext-engine-consumer `spring-kafka` + jay infra 커밋) → PlanNext 맥락은 유지. 가로랜드북(LBDeveloper, Rails)을 랜드북(Kotlin/Spring)과 분리.

**공개 사이트 정정·배포 완료:** commit `37038b3`(MSA설계)→`1e2b62b`(Kafka/Redis). `cv.json`·`landbook-msa.md` 수정, `pnpm build` PASS·disclosure 통과, **Actions 배포 success·라이브 반영 검증**(Kafka/Redis·"수 분→수 초" 잔재 0, "매물 배치 알림" 반영). my-wiki도 push 완료(`199fd42`).

4. **파킹 검증 — 전 프로젝트 커밋 수 실측 정정** (2026-07-13, 로컬 shortlog + gh). 공개 metrics가 다수 부정확: **MIRIVA 257→570, Ground Control 600→734, garo 722→482, zippit 550→586, Nova "공개 OSS 441"→"단독·공개 OSS"**(441은 회사 v1, 공개 v2는 27이라 오해 소지). markwand 225·markbrief 116은 정확(유지). **검증 통과**: GC 신뢰도 3단계(certain 11/likely 15/hypothesis 10 실코드), MIRIVA read-only(describe만 AWS, create/delete는 앱 SQLite — "AWS write 0" 유효). 미확인(파킹): realty-data·planreview Redis 스택.

### Next steps
- **정정·배포 완료.** 별도 후속 없음.
- 파킹: PlanReview·Ground Control·Realty 등 다른 프로젝트도 협업/기여·스택 주장을 커밋으로 재검증하면 좋음(같은 방식) — 근식 요청 시.
- 인터뷰 준비 남은 것: 브리핑 html §8 체크리스트(갭 답변 연습, retail.plannext.ai·Nova GitHub 데모 탭).

### Touch points
- `src/data/cv.json` — CAREER[0] highlights②·PROJECTS "Landbook·가로주택정비" overview/achievements. 검증: `python3 -c "import json;json.load(open('src/data/cv.json'))"` → valid.
- `src/content/projects/ko/landbook-msa.md` — positioning/shows/role/decision/metrics.
- 재검증: `pnpm build 2>&1 | tail -3` → PASS + "✔ PASS (dist): 알려진 시크릿 패턴 미발견".
- 인터뷰 자료(공개 아님, my-wiki): `../my-wiki/writing/interviews/{narnia-labs-1차.md, narnia-labs-2-모의드릴.md, narnia-labs-cheatsheet.html}`. 브리핑 로컬 열람: `python3 -m http.server 8899` 후 `localhost:8899/narnia-labs-cheatsheet.html`.
- 근거(my-wiki): `work/landbook-msa.md`(커밋 실측표+정직성 경계), `work/nova.md`(v1/v2), `_evidence/2026/2026-07-03-github-audit.md`.

### Decisions
- **랜드북 스택 = WebFlux·Coroutine만** — Kafka·Redis는 랜드북 `build.gradle`에 의존성 0이라 이력에서 제거. Kafka/Redis/Argo는 PlanNext.AI에서만 사용(spring-kafka·infra 커밋으로 검증)이라 그 맥락만 유지. 미검증 수치(수 분→수 초·boundedElastic·3회/5s·수만 건)는 삭제, 검증된 "매물 배치알림 병렬처리(blocking→non-blocking)"만 유지.
- 이력/포폴에서 Landbook은 "MSA 설계"가 아니라 "이미 MSA인 환경에 합류해 개발·운영(garo 최다 기여)"으로만 표기 — 커밋 실측이 근거, 과장 금지.
- 게이트웨이(api-gateway 82커밋)는 기여 사실이라 CV 유지하되 "설계"→"개발·운영".
- Nova는 v1(doer 프레임워크)/v2(keeper 재설계) 구분, 커밋 수로 우열 말하지 않음. 멀티 에이전트 오케스트레이션=Crewdeck.
- 인터뷰 준비자료는 private(my-wiki)에만, 공개 레포 커밋 금지.

## 2026-07-10 — SoT 최신화 + my-wiki 단일화

- **단일 SoT 전환 완료·원격 반영:** `givepro91/my-wiki`에 기존 social OS의 포지셔닝·주간 분석·초안·캘린더·운영 절차를 `writing/social/`·`.system/social/`로 이관하고, 원본 분석·레거시 지침은 `_evidence/2026/social-portfolio-os/`에 보존. 최종 commit `1833598` push 완료.
- `my-wiki`의 중복 지침·스킬도 정리: `AGENTS.md → CLAUDE.md`, `.agents/skills → .claude/skills` 심링크로 원본을 하나씩만 유지(commit `9e8758b`).
- `jay-swk/social-portfolio-os`는 이관된 중복 86파일을 제거해 안내 파일 4개만 남기고 commit `8abf2cd` push, GitHub archive 완료.
- Codex 자동화 `weekly-social-portfolio-review`를 `Weekly My Wiki Social Review`로 갱신. 기존 스케줄·모델은 유지하고 `/Users/keunsik/develop/givepro91/my-wiki`만 작업하도록 변경. core facet·`public: true` 자동 변경 금지.
- 이 레포의 `AGENTS.md`는 두 SoT 참조를 제거하고 `givepro91/my-wiki` 하나만 상위 SoT로 사용하도록 변경.

### 공개 사이트 최신화 (검증 완료·최종 커밋)

- `jay-swk/social-portfolio-os` 최신 주간 근거(2026-07-06)와 핵심 `strategy/` 6종, `givepro91/my-wiki`의 최신 cognitive 근거를 대조함.
- 공개 반영: 실행 게이트·재검증 가능한 인계 문서·폐기 승인 기준을 홈 Now, CV 현재 관심사/Highlights, 포트폴리오 WHY ME에 반영.
- PlanNext.AI → PlanNext Retail 계보가 검증된 상태라 CV 대표 프로젝트를 `PlanNext Retail · PlanNext.AI`로 통합. 기존 프로젝트 수와 PDF 밀도는 유지.
- 공개 GitHub 저장소에서 리브랜드와 운영 상태를 재확인해 Lab의 `Nova Orbit`을 `Crewdeck`으로 변경하고 공개 링크 추가.
- 비공개이거나 `public: true`가 없는 cognitive SoT 신규 항목, 고객 정보, 미검증 항목은 공개 콘텐츠에 반영하지 않음.
- 검증: `pnpm build` PASS(source/dist disclosure 포함), 정적 UI 감사 실행(기존 경고 4건, 변경 무관), 브라우저 1440×900·390×844 홈/CV/포트폴리오 확인(가로 overflow·console error 0), 실제 출력 CV 4p·포트폴리오 11p 유지 및 PNG 육안 확인.
- `src/data/cv.json`, `src/data/lab.ts`, `src/pages/index.astro`, `src/pages/portfolio/print.astro`와 이 핸드오프를 이번 마무리 커밋에 포함. 사용자 소유 `design.md`, `docs/design/`은 건드리지 않음.
- Next: 별도 후속 작업 없음. 다음 월요일 자동화는 `my-wiki/writing/social/`만 갱신하며, 사용자 디자인 초안은 독립 작업으로 남김.

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
9. **portfolio/print de-slop(부분)** — 사용자가 포폴 반영 여부 확인. 제목·부제·경력summary는 이미 반영(공유). 포폴 자체 카피는 "X가 아니라 Y" 판단 소바이트가 정체성이라 보존하고, **수사적 화살표만** 3곳 정리(why-foot "문제 정의 → 판단 → 운영 안전장치" 체인, "수 분→수 초", "동기→비동기"). 보존: 브랜드 "문제 → 판단 → 증명"·다이어그램 화살표·0→1·인용 원칙·"아니라" 18개. 포폴 PDF 10쪽 유지. **커밋 `7d11db6` 배포 완료.**
재빌드 PASS·이력서 PDF 4쪽 유지 매 라운드 확인(커밋 c3738d6·97ac867·7fe7b08·23650b0·7d11db6 라이브).

## 🆕 진행 중 (미커밋·검증대기) — 포폴에 Josh 전략 '내용' 반영
사용자 지적: "포폴은 스타일만 고쳤고 Josh가 말한 내용(②축 제품증거·①축 차별점)은 미반영." + ②축 자료 제공(retail.plannext.ai demo/0000, planreviewer 캡쳐 4장). → **포폴 실질 재구조 완료, 미배포.**
- ② 제품증거: **PlanNext Retail 신규 카드**(`plannext-retail.md`, order 8, link retail.plannext.ai) + **PlanReview MAIN 승격**. 둘 다 포폴 MAIN 5선→6선에 추가, zippit은 others로. 실제 화면 캡쳐 적재(웹 압축): `public/og/plannext-retail.png`·`planreviewer-{hero.jpg,upload.png,review.png}`. galleries.json work+cv 갱신.
- ① 재프레임: WHY ME 01=회사차원 운영기반(개인 OSS→증명으로 강등), 02=②풀스택제품, 03=신뢰성. EXPERTISE=AI Operations/AI Product/Data Reliability 두 축. PROFILE s-ctx·figcaption "마스킹" 문구 제거. OTHER WORKS 페이지번호 동적화({TOTAL-1}).
- **빌드 PASS(17p)·게이트 통과, 포폴 케이스 01 PlanNext·02 PlanReview(실 도면판정 화면) 렌더 육안 확인.**
- ⚠️ **PlanNext Retail 카드 서사 = 추론(unverified).** CEO 추천서+제품화면 기반 초안 — 역할/핵심판단/스택을 사용자 검증 후 배포해야 함. PlanReview 실클라이언트 도면(중동·망원동)은 **사용자 명시 승인**으로 공개 OK.
- **정렬 재배치(사용자 "순서 애매" 지적):** 제품 상단 고정 + 최근성·기여도순. 포폴 MAIN = `[plannext-retail, planreview, ground-control, nova, landbook-msa, realty-data-pipeline]`. 카드 `order` 11개 일괄 재번호(plannext1·planreview2·gc3·nova4·landbook5·realty6·zippit7·garo8·miriva9·markwand10·markbrief11·medincurl90) → 홈 Work + 포폴 OTHER WORKS 표 동시 정렬. 빌드 PASS. **미결 질문: Landbook(lead 1,800)을 더 위로(기여 우선) vs 현재(최신 단독 GC·Nova 아래).**
- **상세페이지 진입 버튼 누락 픽스(사용자 지적):** `ProjectCard.astro`의 "자세히" 링크가 `visibility==public && link`일 때만 떠서 anon 8/12 카드에 버튼 없었음 → **항상 "자세히 보기 →" 노출**(상세는 모든 카드 존재), `.wc-link` 알약 버튼화(호버 채움). dist 홈 wc-link 12개 확인.
- **PlanNext Retail 카드 강화(사용자가 실제 제품화면 4장 추가 제공, demo/0000):** 입지·유동인구 분석→참고사례→AI 전략 다중안(Balanced/Focused/Exploratory)→2D·3D 자동설계→AI 포토리얼 렌더→DXF·검증(plan_c.json·149 fixtures). 내 "설계 데이터 모델 분리" 추론은 검증됨. `plannext-retail.md` 서사 재작성, 갤러리=[plannext-3d.jpg(3D렌더), plannext-plans.png(3안), plannext-analysis.jpg(입지), plannext-retail.png(랜딩)], 포폴 FLOW/EVID/SHOT 갱신. **상세 히어로=3D 렌더, 빌드 PASS, 육안 OK.** (스택 실프레임워크는 여전히 unverified — 캡쳐에 안 나옴.)
- dev 서버 localhost:4322 hot-reload 중. **전부 미커밋·미배포 — 사용자 로컬 검토 후 커밋·배포 예정.**

①은 **완료**: `CLAUDE.md` 없어서 만들지 묻길래 — 이미 같은 역할의 `AGENTS.md`가 있어 별도 생성 시 드리프트라 판단 → AGENTS.md에 운영규칙 보강 후 `CLAUDE.md → AGENTS.md` 심링크로 단일 SoT 유지. 불필요한 `NOVA-STATE.md` 삭제.

②는 **구현·검증 완료**: Josh(조성현) 이직 자문(=`http://josh-dev:8889/resume-jang.html` + 슬랙)을 정체성 SoT(`jay-swk/social-portfolio-os/strategy`)·현재 사이트와 대조. 핵심 갭 = ① AI Operations & Agent Infrastructure(회사 차원 거버넌스·인프라·비용)가 스페이스워크 경력에 한 줄도 없었음 → 신설. 스펙=`docs/superpowers/specs/2026-06-30-cv-two-axis-reframe-design.md` 대로 8파일 편집. **빌드 PASS(16p)·disclosure 게이트 통과, 이력서 PDF 4쪽 유지(헤드라인·①/② 구조 렌더 육안 확인), 절대금액·연봉·"90%"·옛 직책 잔존 0건 grep 검증.**

직전 핸드오프 "AI 말투 정리"는 이미 커밋됨(`9e949bf`) — 해소.

## Next steps
- **사용자 검증 대기 (PlanNext Retail 카드 서사).** 역할/핵심판단/스택이 맞는지 확인 받기 → 틀리면 `src/content/projects/ko/plannext-retail.md` 수정.
- 검증되면 **커밋+배포** (명시경로만, `git add .` 금지):
  `git add src/content/projects/ko src/data/galleries.json src/pages/portfolio/print.astro public/og/plannext-retail.png public/og/planreviewer-hero.jpg public/og/planreviewer-upload.png public/og/planreviewer-review.png docs/handoff/main.md`
  (※ `src/content/projects/ko`는 신규 plannext-retail.md + order 재번호된 10개 카드 포함. `git add .` 금지.)
  → `git commit` → `git push origin main` → `gh run watch` success → 라이브 `givepro91.github.io/portfolio/print` 확인.
- 옵션: PlanNext Retail을 `/cv`에도 추가(현재 포폴+홈Work만 노출, cv.json PROJECTS엔 PlanNext.AI만 있음). retail.plannext.ai 라이브 콘솔(demo/0000) 추가 캡쳐도 가능(현재는 랜딩만).
- 파킹: 직전 핸드오프 미결 카피건("결정 로그" 라벨)·OG 카카오 캐시는 별건.

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
