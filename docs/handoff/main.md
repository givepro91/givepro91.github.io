---
branch: main
status: active
updated: 2026-08-24T10:50:00Z
---
## 2026-08-24 — SoT 2026-08-24 반영 + 이력서 전면 평문화 + 퇴사일 정정

### Restore in 30s — what you were doing / where you got to / what you just finished
my-wiki(SoT)에 2026-08-24 커밋 2건(수집·정제 + **본인 확인 반영**)이 올라와 있었는데 사이트는 "이직 준비 중"에서 멈춰 있었다. 그 격차를 메우고, 근식 지시로 **퇴사일을 고용보험 기준 2026.08.01로 정정**했고, 추가 요청으로 **이력서 전 표면을 평문화**했다.

**끝난 상태**: 19개 파일 수정 완료, 게이트 포함 빌드 통과, Orca 브라우저로 렌더까지 육안 확인. **커밋·푸시 미실행.**

SoT에서 가져온 사실(전부 본인 확인 2026-08-24)과 공개 경계:

| 항목 | 경계 | 사이트 반영 |
|---|---|---|
| **놀곳** 영유아 부모용 지도, 2026-08-15 App Store 배포(무료) | ✅ 공개 승인. **가입자 수·미완 데이터 비율은 투영 금지** | Work 카드 + CV `SOLO_PROJECTS` |
| **탑과 용병단** 유료 게임 ₩3,300, 2026-08-18 출시 | ✅ 공개 승인 · **"호기심 케이스 — 정체성 축과 분리"** | Lab만 (CV 미기재) |
| **도시정비이음**(urbanrenew) | 🔒 고객사 자산·public 금지. 「도시정비이음」은 **발주 업체명** | CAREER 한 줄만, 고객사명 없이 |
| Coxwave 사전 과제 | 🔒 채용 과제 | 미기재 |
| 정체성 한 줄 | 변경 없음 | 손대지 않음 |

배치는 근식 선택: **놀곳=Work 대표작+CV / 탑=Lab만 / 외주=CAREER 한 줄 / 히어로 상태 배지 현행 유지**.

### Next steps — concrete next actions / blockers / parked
**다음 액션**
1. **커밋·푸시** (요청 시에만). `git add` 는 아래 Touch points의 명시 경로만 — `git add .` 금지.
2. **`/cv/print` PDF 밀도 육안 확인 (unverified)** — 핵심 역량 요약을 7줄→8줄로 늘려야 놀곳 출시 줄이 PDF에 들어갔다(`src/pages/cv/print.astro:68`). 페이지가 밀리면 상한을 되돌리거나 다른 줄을 뺀다. **인쇄 미리보기로는 확인하지 않았다.**
3. **`portfolio/print` 육안 확인 (unverified)** — 텍스트 grep 으로만 검증했고 레이아웃은 안 봤다.

**블로커 / 이미 시도한 것**
- **`pnpm` 이 이 세션 셸 PATH에 없다.** `corepack`·글로벌 설치·`~/.nvm` 모두 없음을 확인했다. `package.json` 의 `build` 3단계를 `node scripts/check-disclosure.mjs --source && ./node_modules/.bin/astro build && node scripts/check-disclosure.mjs --dist` 로 직접 실행해 대체했다(동일 명령). 근식 셸에선 `pnpm build` 그대로 쓰면 된다.
- **`/cv` 는 JS 스크롤(`window.scrollTo`/`scrollTop`)이 먹지 않는다** — 스크롤스파이가 되돌리는 것으로 보인다(원인 미확정, unverified). 앵커(`/cv/#projects`)와 `orca scroll`(실제 휠 입력)로 우회해 확인했다. **페이지 동작 문제는 아니다.**
- **홈은 `.reveal` 이 IntersectionObserver 기반**이라 즉시 점프하면 빈 화면이 찍힌다. `document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))` 로 강제 노출 후 캡쳐했다.

**파킹 (의도적으로 안 함)**
- `PROJECTS[1].period`(PlanNext `2025.03 – 2026.07`) — 재직 기간이 아니라 프로젝트 기간이고 마지막 출근이 07-24라 그대로 뒀다. 근식에게 알렸고 바꾸라는 지시는 없었다.
- Work 카드·`/roadmap` 의 기술 용어(`서킷브레이커`·`human-in-the-loop`) — 기술 독자용이라 CLAUDE.md 규칙상 허용. 평문화는 이력서 층에 한정.
- `PROJECTS[*].stack` 의 `LLM Serving` 등 — 스택 목록은 평문화 대상 아님.
- SoT 미반영분: `/interview` 봉인본 ↔ 위키 `writing/interviews/` 원본 이중관리 정리(harvest §E-6), 브런치 소속 표기가 아직 "Spacewalk"(4회 연속 미조치).
- **dev 서버가 백그라운드로 떠 있다** — `http://localhost:4324` (4321~4323 사용 중). 내리려면 `lsof -ti:4324 | xargs kill`.

### Touch points — path:line, verification command → expected result

**데이터 (수정)**
- `src/data/cv.json` — 퇴사일·프리랜서 CAREER·`SOLO_PROJECTS` 신설·HIGHLIGHTS 8개·CASES 8건 전면 평문화·SKILLS 앞 2그룹+그룹명 4개·PROFILE·VISION
  - `node -e "const d=require('./src/data/cv.json');console.log(d.CAREER.length,d.HIGHLIGHTS.length,d.SOLO_PROJECTS.length)"` → `7 8 1`
  - `node -e "const d=require('./src/data/cv.json');console.log(d.CAREER[1].period,d.CAREER[1].duration)"` → `2023.01 – 2026.08 3년 7개월`
- `src/data/cv.ts:41` — `SOLO_PROJECTS` export 추가
- `src/data/lab.ts:5` — `LabStatus` 에 `released` 추가 / `:13` 탑과 용병단 항목(order 1)

**페이지 (수정)**
- `src/pages/index.astro` — LAB_STATUS 에 `released: { label: "출시", cls: "tool" }` · 인포박스 `2023.01–2026.08` · 도메인 `부동산(프롭테크) × AI`
- `src/pages/cv/index.astro:3` — `SOLO_PROJECTS` import(**빠뜨려서 빌드가 한 번 깨졌다**) · `:13` projectGroups 에 개인 제품 그룹 · `:17-20` AXES 한글화
- `src/pages/cv/print.astro:3` import · `:10-15` SKILL_GROUPS 평문화 · `:20-23` AXES 한글화 · `:68` `HIGHLIGHTS.slice(0, 8)` · 개인 제품 섹션 추가
- `src/pages/portfolio/print.astro:163` — `g.group.includes("Backend")` → `"백엔드"`(**SKILLS 그룹명 한글화로 깨진 조회**) · `:161` 평문화 · `:252` `(confidence 55%·conditional-go)` 제거

**콘텐츠**
- `src/content/projects/ko/nolgot.md` — **신규**(theme `reliability`, order 3, visibility public, App Store 링크, riskChecked 2026-08-24)
- order만 +1: `ground-control(4)` `nova(5)` `landbook-msa(6)` `realty-data-pipeline(7)` `zippit(8)` `garo-landbook(9)` `miriva(10)` `markwand(11)` `markbrief(12)` — `medincurl(90)` 은 그대로
  - `grep -H "^order:" src/content/projects/ko/*.md` → 중복 없음, nolgot=3

**문서**
- `AGENTS.md:5` (=`CLAUDE.md` 심볼릭 링크) — 퇴사 기준을 `2026-08`, 고용보험 2026.08.01 명시

**검증 명령 → 기대 결과**
```
node scripts/check-disclosure.mjs --source          → PASS
./node_modules/.bin/astro build                     → exit 0, error/warn 0
node scripts/check-disclosure.mjs --dist            → PASS
grep -ril "eumgrid\|도시정비이음\|urbanrenew\|coxwave\|가입자\|Cloudflare\|Lightsail" dist/ | wc -l   → 0
node -e "const d=require('./src/data/cv.json');const w=(o,p='')=>{if(typeof o==='string'){if(/→/.test(o))console.log(p)}else if(Array.isArray(o))o.forEach((v,i)=>w(v,p+'['+i+']'));else if(o&&typeof o==='object')Object.keys(o).forEach(k=>w(o[k],p+'.'+k))};w(d)"   → 출력 없음(화살표 체인 0)
```
전부 실행해 통과 확인함. **`.astro` 캐시가 stale하면 `Duplicate id` 경고가 뜬다 — `rm -rf .astro dist` 후 재빌드하면 사라진다(파일 중복 아님, 실측 확인).**

**브라우저 육안 확인 (Orca, `orca tab create --url` → `orca screenshot`)**
홈 히어로(직전 2023.01–2026.08 · 도메인 평문) · Work `log.003` 놀곳 카드 · Lab 01번 탑과 용병단 "출시" 배지 · `/cv` 경력(프리랜서 + 3년 7개월 + 한글 축) · `/cv` 개인 제품 그룹의 놀곳 — **전부 정상 확인.**

### Decisions — one line each
- 재직 기간 표기는 **고용보험 기준**(2023.01 – 2026.08)으로 통일하되, 프로젝트 기간(`PROJECTS[1]`)은 실제 작업 종료 시점이라 2026.07 유지.
- 놀곳은 **Work 대표작 + CV 신규 그룹**, 탑과 용병단은 **Lab만** — SoT의 "게임은 정체성 근거로 쓰지 않는다"를 데이터 배치로 강제.
- 외주는 **CAREER 한 줄, 고객사명·도메인·조직명·커밋 수 전부 제외** — 고객사 자산 경계 + CLAUDE.md 고객명 금지.
- 히어로 상태 배지는 **현행 유지**(근식 선택) — 외주·출시는 본문에서만 드러냄.
- CV에 개인 제품을 넣으려고 `SOLO_PROJECTS` 를 **새 배열로 분리** — 기존 `AX_PROJECTS`(AI 에이전트 운영)에 섞으면 그룹 의미가 깨진다.
- Lab 상태값에 `released` **신설** — 기존 5개(active/prototype/experiment/paused/side)에 출시된 상용 제품을 담을 자리가 없었다.
- 평문화 범위는 **이력서 층(cv.json + /cv + /cv/print + portfolio/print 문장)** 으로 한정, Work 카드·roadmap의 기술 용어는 유지.
- SKILLS 그룹명을 한글화할 땐 `portfolio/print.astro` 의 `group.includes(...)` 조회를 **반드시 같이 고쳐야 한다**(이번에 깨뜨렸다가 고침).

## 2026-08-13 — /interview 비공개 면접 준비 페이지 (내용 암호화)

### Restore in 30s
근식 요청: 이력서 기반 면접 문답(CS·직무·조직)을 모아두되 본인만 열람. **공개 레포·공개 Pages 라 단순 비번 게이트는 보호가 아니라고 판단** → 내용 자체를 AES-256-GCM 으로 봉인하고 브라우저에서 비번으로 푸는 구조로 구현. 41문항(CS 14·직무 14·조직 13) 작성·봉인·배포 완료.

### 구조
```
private/interview/*.md   평문 원문. gitignore. 커밋된 적 없음
  │  pnpm interview:seal  (비번은 실행 시 입력, 어디에도 저장 안 함)
  ▼
src/data/interview.sealed.json   salt·iv·암호문만. 이것만 커밋
  ▼  astro build → 페이지에 인라인
/interview  → 비번 입력 → 브라우저 Web Crypto 로 복호화
```

- 암호: PBKDF2-SHA256 310,000회 → AES-256-GCM. Node `node:crypto` 봉인 ↔ 브라우저 `crypto.subtle` 해제 호환 검증함.
- **비밀번호는 이 레포·CI·어디에도 없다.** 분실하면 원문(`private/`)에서 새 비번으로 다시 봉인하는 방법뿐.
- 내용 갱신: `private/interview/*.md` 고치고 → `pnpm interview:seal` → `src/data/interview.sealed.json` 커밋·푸시.
- 봉인 스크립트는 `git ls-files private/` 가 비지 않으면 **중단**한다(평문 유출 마지막 방어선).

### Touch points
- 신규: `scripts/lib/interview-crypto.mjs` · `scripts/lib/interview-content.mjs` · `scripts/interview.test.mjs`(16 테스트) · `scripts/seal-interview.mjs` · `src/pages/interview.astro`
- 수정: `.gitignore`(`private/`) · `scripts/check-disclosure.mjs`(SKIP_DIR 에 `private`) · `astro.config.ts`(사이트맵에서 `/interview` 제외) · `package.json`
- 문서: `docs/superpowers/specs/2026-08-13-interview-page-design.md` · `docs/superpowers/plans/2026-08-13-interview-page.md`
- **robots.txt 는 일부러 만들지 않았다** — `Disallow: /interview` 는 숨기려는 경로를 공개적으로 광고하는 역효과. 차단은 `noindex` 메타 + 사이트맵 제외 + 링크 없음으로.

### Verify
- `node --test scripts/interview.test.mjs` 16/16 PASS · `pnpm build` 게이트(source·dist) PASS
- dist 평문 잔존 0건(`코루틴이 스레드와`·`이직을 결심한`·`임계값 5회`·비밀번호 문자열) · 사이트맵에 `/interview` 0건
- 브라우저 실측: 틀린 비번 거부 → 정상 비번 해제 → 탭 전환·검색·모두 펼치기 동작 확인

### Next steps
- 콘텐츠는 초안이다. **"이직을 결심한 이유"는 뼈대만 적어뒀다** — 본인 문장으로 채워야 함(퇴직 사유는 레포에 안 쓴다는 규칙 유지).
- 근식이 본인 비번으로 재봉인 권장(현재 비번은 세션 대화에 노출됨). `pnpm interview:seal` 후 sealed.json 커밋·푸시 2단계.

## 2026-08-11 — 정체성 헤드라인 여정형 재개정 (백엔드 한정 인상 해소)

### Restore in 30s
근식 요청("백엔드로 제한된 느낌, AI/프로덕트 엔지니어도 포괄")으로 헤드라인을 **여정형으로 재개정**: `제품을 만드는 백엔드 엔지니어` → **`백엔드에서 출발해 AI 제품까지 만드는 엔지니어`**, 부제 `서버에서 출발해, 문제를 풀 수 있는 데까지` → **`서버가 토대, 제품이 방향`**. 어순 규칙도 개정 — 백엔드가 출발점 · AI 제품이 도착점 · 명사는 '엔지니어'. 직무명 금지·스택 나열 금지는 유지. 3안(여정형/명사 개방형/부연 확장형) 중 근식이 여정형 선택.

### Touch points
- `src/config.ts` — SITE.title/subtitle + 주석(개정 근거). tagline은 유지.
- `src/data/cv.json` — PROFILE.title/subtitle + summary 첫 문장.
- `src/pages/portfolio/print.astro` — 표지(cover-name)·PROFILE s-ctx 하드코딩 2곳.
- `AGENTS.md`(=CLAUDE.md) — "⚠️ 정체성" 절 제목·정본·어순 규칙 재작성, 개정 이력 3단계로 갱신.
- 검증: `pnpm build` PASS(소스·dist disclosure 게이트 통과), dist에 새 헤드라인 반영 확인, 옛 문구 잔존 0.

### Next steps
- **커밋·배포는 미실행** (사용자 요청 시에만). 스테이징 대상: 위 4개 파일 명시 경로.
- my-wiki `values/why-product-first-positioning.md`에 2026-08-11 재개정 기록 추가 필요(AGENTS.md가 이 파일을 근거로 참조 중) — 근식 요청 시.

## 2026-08-11 — AX_PROJECTS 섹션 평문화 (면접에서 본인이 말할 수 있는 문장으로)

### Restore in 30s
근식 피드백: "AI Agent Ops 섹션이 너무 어렵다. 채용은 이력서 기반 질문인데, 내 이력서인데 내가 내용을 파악하기 어렵다." → CV의 AX_PROJECTS 4개(Nova·Ground Control·MIRIVA·Realty) 문구를 **‘무엇을 했고 왜 그랬는지’를 일상어 한 문장으로** 재작성. 원칙: 검증된 사실(55% 판단·245행 보존·13커밋 기여 범위)은 유지, 전문용어는 꼭 필요한 것만 괄호로. 예: "크롤러 resilience — 429·403·5xx를 서킷브레이커·백오프·jitter로 처리" → "사이트가 접속을 제한하면 잠시 멈췄다가 간격을 늘려 재시도하고, 차단 신호가 쌓이면 스스로 수집을 중단". "PRD를 적대적 자기검증 가설 문서로(confidence 55%·conditional-go)" → "기획 문서에 성공 확신 대신 ‘성공 확률 55%, 조건 확인되면 진행’ 판단 기준을 그대로 적음". 섹션명도 "AI Agent Ops" → "AI 에이전트 운영".

### Touch points
- `src/data/cv.json` — AX_PROJECTS overview·achievements·tagline 14곳 문자열 교체(내용 사실은 동일, 표현만).
- `src/pages/cv/index.astro` — projectGroups[0] label·note 평문화.
- `src/pages/cv/print.astro` — 해당 섹션 h2·blocknote 평문화.
- `src/content/projects/ko/realty-data-pipeline.md` — shows "크롤러 resilience"→"크롤러 안정성", decision 문장 평문화(카드는 기술 독자용이라 괄호 용어는 유지).
- **(후속) 스페이스워크 PROJECTS 3개도 같은 기준 적용** — PlanReview("web → server → 큐 → worker" 화살표 체인, "경계 설계", "배포 가드레일로 봉합"), PlanNext Retail(스택 나열형 성과 → 상품화 서사), Landbook("(blocking→non-blocking)", "(토대)" 태그라인) 평문화. CAREER 스페이스워크 highlights 중 같은 압축체 2곳(①Landbook·①PlanReview)도 수정. 공개 카드 `planreview.md`(shows·result·learning)·`landbook-msa.md`(decision)와 `portfolio/print.astro` planreview 불릿도 정합 맞춤.
- 검증: `pnpm build` PASS(게이트 통과), dist에 "적대적 자기검증·크롤러 resilience·jitter·blocking→non-blocking·web → server" 잔재 0.

## 2026-08-11 — 포트폴리오·전 표면 확장 (평문화 + 시제 + ⚠️사실 정정)

### Restore in 30s
근식 추가 지시 2건: ① "포트폴리오도 같은 기준?" → 전면 점검 실행, ② "퇴사했는데 진행형 문구가 보임" → 스페이스워크 관련 시제 정정. 점검 중 **7/13 사실검증 결정 위반 3건을 포트폴리오 인쇄본에서 발견·정정**: (a) Landbook 도식 cap "무거운 작업은 Kafka로 떼어 격리"(Landbook에 Kafka 없음 — 실측), (b) ROLE/EVID "MSA 설계"·"핵심 서비스 설계 (lead committer)"(설계 아님·합류 개발·운영), (c) Realty "atomic swap·안전 규칙 훅 강제·silent fail 차단"을 본인 성과처럼 서술(타 기여자 몫) → 크롤러 안정화·체크포인트 재개로 재초점. WHY ME 카드 03도 같은 이유로 재작성. 시제: PlanReview "2026 – 현재"→"2026"·"현재는 자문을 맡고 있습니다"→"후반에는 자문 역할로 참여했습니다"(cv.json+카드), PlanNext "2025.03 – 현재"→"– 2026.07". zippit "운영하고 있습니다"는 개인 서비스 현재 운영이라 유지.

### Touch points
- `src/pages/portfolio/print.astro` — FLOW(nova·landbook·realty)·ROLE·PRINCIPLE·EVID·SHOT pins·WHY ME 카드 3개·EXPERT rows·MIRIVA 각주. "지식 SoT"→"지식 기준", "풀스택"→"기획부터 …까지 직접".
- `src/data/cv.json` — PlanReview·PlanNext 시제/기간, SKILLS·CASES의 "적대적 게이트"→"독립 검증 게이트"·silent fail 평문화.
- 카드: `nova.md`(positioning·shows·decision·result), `miriva.md`(전반), `markbrief.md`(1급·도메인 무지·dogfooding), `ground-control.md`(화살표 role·human-in-the-loop), `planreview.md`(role·metrics 시제).
- `src/pages/roadmap.astro` — "적대적" 4곳, Realty evidence 재초점.
- `src/pages/cv/print.astro` — 스킬 라인 "적대적 게이트" 교체.
- my-wiki `6aba6b5` — 여정형 재개정 기록(values·me.md·profile-copy·README) push 완료.
- ⚠️ 재검증 후보: 포폴 인쇄본 Landbook "합산 ~1,800 커밋"(garo 482+auth 484+payment 526+gw 82=1,574+premium 미확인) — 실측 재확인 권장.

## 2026-08-11 — CV 단기 경력 제거 + 인쇄 p3 빈 페이지 해소 + Working Principle 재구성

### Restore in 30s
근식 지시 3건. ① **단기 경력 2건 삭제**: 메일플러그(인턴 4개월)·인포맥스(프리랜서 3개월) — cv.json CAREER에서 통째 제거(다른 참조 없음, mini 리스트·웹 CV 자동 반영). ② **인쇄 p3 텅 빔**: 원인은 AX 섹션의 `r-keep`(섹션 통째 페이지 유지) — 평문화로 문장이 길어지며 섹션 전체가 p4로 밀려 p3 하단이 통째로 비었음. 해법은 "생략분 다시 채우기"가 아니라 **흐름 개선**: AX·제품백엔드 섹션의 r-keep 제거, 대신 `.r-proj { break-inside: avoid }`(프로젝트 단위 유지) + `h2/blocknote { break-after: avoid }`(제목이 첫 항목과 붙어 넘어가게). ③ **Working Principle**: AI 원칙 하나 + "AX 리드 되겠다" 포부(포지셔닝 위반)뿐이던 것을 → headline(AI 판단 경계) 유지 + **제목 있는 원칙 4개**(비정상 상황 먼저 설계 / 문제 정의가 기능보다 먼저 / 판단과 근거 기록 / 서비스는 사람 연결)로 재구성. 데이터 스키마 `VISION.body`→`VISION.principles[{title,text}]`, cv/index·cv/print 렌더 동시 수정. roadmap "AX 리드의 정체성" 문구도 규칙 맞춰 정정.

### Touch points
- `src/data/cv.json` — CAREER 2건 제거·VISION 재구성. `src/pages/cv/print.astro` — r-keep 제거+인쇄 CSS·principles 렌더. `src/pages/cv/index.astro` — principles 렌더. `src/pages/roadmap.astro` — AX 리드 문구.
- 인쇄 페이지 흐름은 CSS 로직으로 해소했으나 **실제 ⌘P 미리보기로 페이지 경계 확인 권장**(근식 육안 확인 전).

## 2026-07-13 — 나니아랩스 인터뷰 준비 + Landbook 이력 과장 정정 (커밋 실측 기반·배포 완료)

### Restore in 30s
나니아랩스(Narnia Labs) AI Product Engineer 1차 인터뷰 준비자료를 `my-wiki/writing/interviews/`에 만들고, **커밋 실측으로 이력 과장 3건을 잡아 공개 CV/포폴까지 정정·배포 완료.**
1. **Nova v1/v2 구분** — "Nova=단일 에이전트 품질" 틀림. v1(`TeamSPWK/nova`, 회사, 오케스트레이션+품질 5기둥 doer)·v2(`givepro91/nova`, 개인, keeper 재설계). 멀티 에이전트 오케스트레이션은 Crewdeck. 근거: 두 레포 README + `givepro91/nova/docs/positioning.md`.
2. **Landbook "MSA 설계" 과장** — 커밋 실측(jay-swk) 결과 모든 서비스 레포가 합류(2023) 전 생성(auth 2020-07·premium 2021-10·payment 2022-02·api-gw 2020-06·garo 2020-11 최다·build 2019-09). → "이미 MSA인 환경에 합류해 개발·운영, garo 최다 기여". "설계" 아님.
3. **⚠️ Landbook Kafka/Redis·수치 과장** — auth/payment/premium `build.gradle`에 **Kafka·Redis 의존성 0**(WebFlux/Coroutine만). "Kafka로 무거운 작업 격리"·"Redis 캐시/Rate Limit"·"대규모 알림 수 분→수 초"는 **근거 없어 삭제**. 검증된 것(WebFlux·Coroutine 비동기 + 매물 배치알림 병렬처리 blocking→non-blocking)만 유지. **Kafka/Redis는 PlanNext.AI에서만 진짜**(plannext-engine-consumer `spring-kafka` + jay infra 커밋) → PlanNext 맥락은 유지. 가로랜드북(LBDeveloper, Rails)을 랜드북(Kotlin/Spring)과 분리.

**공개 사이트 정정·배포 완료:** commit `37038b3`(MSA설계)→`1e2b62b`(Kafka/Redis). `cv.json`·`landbook-msa.md` 수정, `pnpm build` PASS·disclosure 통과, **Actions 배포 success·라이브 반영 검증**(Kafka/Redis·"수 분→수 초" 잔재 0, "매물 배치 알림" 반영). my-wiki도 push 완료(`199fd42`).

4. **파킹 검증 — 전 프로젝트 커밋 수 실측 정정** (2026-07-13, 로컬 shortlog + gh). 공개 metrics가 다수 부정확: **MIRIVA 257→570, Ground Control 600→734, garo 722→482, zippit 550→586, Nova "공개 OSS 441"→"단독·공개 OSS"**(441은 회사 v1, 공개 v2는 27이라 오해 소지). markwand 225·markbrief 116은 정확(유지). **검증 통과**: GC 신뢰도 3단계(certain 11/likely 15/hypothesis 10 실코드), MIRIVA read-only(describe만 AWS, create/delete는 앱 SQLite — "AWS write 0" 유효), PlanReview Redis 실사용(ioredis·redis.ts) 유지.

5. **⚠️ Realty 과장 발견·정정** — realty-data 근식 커밋 **13개**뿐. 실제 기여는 **크롤러 resilience**(서킷브레이커·백오프·jitter·429/403 처리)·**dong 체크포인트·resume**인데, 포폴/cv가 **"atomic swap·Blue-Green·워커훅·OOM·행 뻥튀기"(다른 기여자 몫)를 근식 성과로 서술** → 크롤러 기여로 재초점 정정. 포폴 카드 `realty-data-pipeline.md` 재작성, cv PROJECTS Realty·준비자료 3파일 정정. "atomic swap·silent fail 차단을 내 성과로 쓰지 말 것".

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

---

# 2026-08-07 · 포지셔닝 재정의 + 퇴직 반영 + 레거시 정리

## What
SoT(`givepro91/my-wiki`)에서 한 줄 정체성이 바뀌었고(`values/why-product-first-positioning.md`, 본인 판단), 그 파생으로 이 레포를 정렬했다.

- **정체성**: `Technical Product Lead / AI Operations & Agent Infrastructure` → **"제품을 만드는 백엔드 엔지니어"**. 어순이 곧 주장 — **백엔드=정체(명사) · 제품=방향 · AI=부연**. 직무명(Product Engineer/AX/FDE)은 헤드라인에 박지 않는다(지원처가 백엔드/서버/프로덕트/AI로 갈림).
- **두 축 순서 반전**: ①AI Operations → ①**AI Full-Stack Product Engineering**, ②AI Operations. `cv.json` PROFILE.summary·CAREER[0].highlights 접두, `cv/index`·`cv/print`의 `AXES` 맵, `portfolio/print` EXPERTISE 행·WHY ME 01/02 카드 전부 동일 순서로 맞춤.
- **퇴직 반영**: CAREER[0] `2023.01 – 재직 중`→`2023.01 – 2026.07`, `duration` 3년 6개월→**3년 7개월**, `current: true`→**false**, summary 과거형. `PROFILE.current` 전면 재작성(이직 준비 중). 홈 배지·infobox 2곳. ⚠️ 퇴직 **사유**는 SoT에서 public 금지 — 어떤 형태로도 쓰지 않는다.
- **`ax-field-guide` → `Fieldwork` 리브랜드**(SoT 2026-07-26). **URL은 유지** — `ax-field-guide.vercel.app` 이 살아있고 `<title>Fieldwork</title>` 를 서빙한다(curl 확인). 바뀐 건 이름·성격(AX 단독 필드북 → 5트랙, `basis` 표시제)이므로 **라벨·설명만** 교체.

## 레거시 정리 (실측으로 찾은 것)
- **`SITE.tagline`/`subtagline` 이 어디서도 안 쓰였다** — `index.astro` 가 옛 문구를 하드코딩. config 를 고쳐도 화면에 안 나가던 드리프트. `{SITE.tagline}` 참조로 교체 + 주석으로 재발 방지.
- **`github.com/jay-swk/nova` = 404** (공개 PDF에 실린 죽은 링크) → `github.com/givepro91/nova`(200). 참고: `jay-swk` 계정·`jay-swk/nova-landing` 은 살아있어 유지.
- **`gc.spacewalk.dev`** (퇴직한 회사 내부 도메인)이 PDF 브라우저 크롬에 노출 → `ground-control · 내부`(기존 `realty-pipeline · 내부` 선례와 동일 표기).
- **`jay@spacewalk.tech`**(AGENTS.md 헤더) → `givepro91@gmail.com`.
- **폐기어 "진실원" 10건 전멸** — SoT `CLAUDE.md` 1항 폐기어. `원본`/`같은 데이터를 보고`/`결과 원본`으로.
- 표지 eyebrow 의 `AX = AI Transformation` 정의 리드 제거(AX는 이제 간판이 아니라 방법론 층), `cover-axes` 순서도 Backend 선두로.

## Verify
- `pnpm build` → PASS(17p), `check-disclosure`(source·dist) 통과.
- dist 잔존 0건 검증: `재직 중` · `spacewalk.tech` · `spacewalk.dev` · `jay-swk/nova"` · `진실원` · `AX Field Guide` · `Technical Product Lead · AI Operations`.
- 반영 확인: `제품을 만드는 백엔드 엔지니어` 17p · `2023.01 – 2026.07` 3p · `Fieldwork` 4p · `github.com/givepro91/nova` 1p.

## Next steps
- ⏳ **미처리**: SoT `writing/social/positioning/` 5개 문서(profile-copy·resume-refresh·channel-strategy…)가 아직 옛 간판 기준. **검색 키워드로서의 "서버 개발자" 는 여기서 커버하기로 설계**했으므로(정체는 `me.md` 에 백엔드 하나) 다음 세션에 같이 처리.
- 편집 판단 보류: `cv/index.astro` `projectGroups` 가 AX 개인 OSS 를 회사 제품 위에 둔다. 축을 뒤집은 것과 어긋나 보이나, "지금 뭘 만드는가"를 먼저 보여주는 것도 근거가 있어 본인 판단 대기.
- 커밋·푸시 안 함(레포 규칙: 사용자 요청 시에만).
