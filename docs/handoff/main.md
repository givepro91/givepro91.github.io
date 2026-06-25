---
branch: main
status: active
updated: 2026-06-25T07:48:45Z
---
## Restore in 30s
**(이번 세션·미커밋·배포대기) 사이트 전반 "AI스러운 말투/단어" 정리.** 지인 피드백 = `/cv` 콜아웃 박스 문구가 너무 AI스럽다. 근본 = 영어 직역체("라이브 자산"=live assets)·추상명사 쌓기("판단 구조 재설계")·수동태("보도록 만들어졌습니다")·jargon("table stakes"·"공개 작업 노트"). 콜아웃이 웹/이력서PDF/포폴PDF **3곳에 중복**돼 전부 맞춤. 새 톤 = 홈에 이미 있던 강한 보이스("무엇을 만들었나보다 왜 그렇게 판단했나를 기록")로 통일. **빌드 PASS(16p), dist 잔존 슬롭 0건 검증 완료.** 직전 OG 작업은 이미 커밋됨(`d68c18c`) — 핸드오프 최상단 🆕줄은 그 시점 기준(이제 stale).

## Next steps
- **사용자 결정 대기 — 더 깊게 갈지/멈추고 커밋할지.** 일부러 안 건드린 3개(브랜드 보이스라 임의변경 보류): ①"A가 아니라 B" 구문 15곳(히어로 포함) ②"결정 로그"(nav·섹션제목·OG카드 박힌 브랜드 용어) ③`cv.json` 요약 3번째 문단 6단 명사나열("…→운영 안전장치→성과 측정→재사용 패턴화"를 한 사이클로 만드는 일을 지향합니다).
- 승인 시 커밋: 명시경로 `src/pages/cv/index.astro` `src/pages/cv/print.astro` `src/pages/portfolio/print.astro` `src/pages/roadmap.astro` (`git add .` 금지 — 명시경로만).
- 로컬 육안: `pnpm dev` → `/cv` 콜아웃·`/roadmap` 02섹션 확인.
- 참고: roadmap.astro 마지막 1-word 수정("직접 만든 결과"→"만든 결과") 후 **재빌드 안 함** — dist 1단어 stale(unverified, 배포 전 재빌드하면 해소).

## Touch points
- `src/pages/cv/index.astro:70-85` — 콜아웃(리드+카드 2). 검증: `grep -c "라이브 자산\|판단 구조 재설계" dist/cv/index.html` → 0
- `src/pages/cv/print.astro:43-45` — 이력서 PDF 콜아웃 미러
- `src/pages/portfolio/print.astro:262` — 포폴 PDF AX 카드 desc("공개 작업 노트" 제거)
- `src/pages/roadmap.astro:4,120` — "table stakes"→"기본 요건"
- 전체 검증: `pnpm build 2>&1 | tail -4` → PASS 16p · `grep -rl "라이브 자산\|판단 구조 재설계\|보도록 만들어\|공개 작업 노트\|table stakes" dist/` → 0건

## Decisions
- 명백한 직역·jargon·수동태만 제거하고, 의도된 브랜드 프레임("문제→판단→증명"·"결정 로그" 라벨)은 보존 — 정본 = social-portfolio-os 전략.
- 콜아웃 새 톤은 신규 창작이 아니라 홈 subtagline 보이스 재사용 → 사이트 전체 일관성.
- "table stakes"→"기본 요건"(주석 포함), "공개 작업 노트"→"현장에서 정리·공개".

---
### 이전 세션 이력 (아래는 과거 로그, 참고용)
> 🆕 **(이전 세션) OG 이미지 = raw 프로필 사진 → 디자인된 브랜드 카드로 교체.** 사용자 "링크 공유 시 OG가 내 사진 바로 나옴, 그럴싸하게" (레퍼런스 = 토스 open-graph 가이드: 선명·로고+슬로건·직관). **근본 원인 = `BaseLayout.astro`에 `og:image` 태그가 아예 없었음** → 카카오톡 등이 페이지를 긁어 `public/cv/profile.jpg`(헤드샷)를 OG로 사용. **해결**: ① 브랜드 카드 1200×630 PNG 디자인·렌더 = scratchpad `og.html`(라이트+브랜드블루 #2563eb·Pretendard+JetBrains Mono·도트그리드·블루글로우, 좌=이름/역할/킬러태그라인["AI가 안전하게 일할 수 있는 운영 구조" 블루강조]/칩+URL, 우=프로필을 **풀블리드가 아니라 라운드 프레임**+상태펄·서브카피) → 헤드리스 Chrome 2배 렌더(`--force-device-scale-factor=2`, `--allow-file-access-from-files`) → magick 1200×630 다운스케일(선명도) → `public/og/og-default.png`(340k). ② `BaseLayout.astro`에 `image?` prop + `ogImage=new URL(image??"/og/og-default.png",SITE_URL)` + OG/twitter 풀세트(og:image[+secure_url/type/width 1200/height 630/alt]·twitter:image·og:site_name·og:locale ko_KR). **검증**: `pnpm build` PASS(16p), dist 홈·CV·로드맵 전 페이지 `og:image=https://givepro91.github.io/og/og-default.png` 절대URL 주입·이미지 dist 반영·렌더 육안 OK. **치수**: 토스는 1200×600 권장이나 1200×630(1.91:1 de-facto 표준, 카카오/링크드인/트위터 전부 호환) 채택. **다음 = 사용자 승인 시 커밋·푸시**(명시경로: `src/layouts/BaseLayout.astro` `public/og/og-default.png` `docs/handoff/main.md`). ⚠️ **배포 후에도 카카오톡은 기존 스크랩을 캐시** → 즉시 안 바뀌면 카카오 캐시 만료 대기 또는 공유 디버거로 갱신 필요.
> 🟢 **(최종+) AI Agent Ops 섹션 내용 확장으로 p3 공백 제거 + footer 정리로 4페이지 유지.** 사용자가 "p3 AI Agent Ops 하단 공백이 크니 더 다양하게 풀어달라(주제 확장/요소 추가)"·"마지막 빈 페이지도 마찬가지" 요청 → ① **AX 4번째 항목 추가 = Realty Data Pipeline**(무중단 ETL·silent fail 차단·안전규칙 훅 강제 — `realty-data-pipeline.md` anon 기반, cv.json AX_PROJECTS에 추가). ② **AX 항목당 achievements 2→3개**(print AX 맵만 slice(0,3); Projects 맵은 slice(0,2) 유지). ③ AX 헤딩 "·데이터 신뢰성" 추가 + blocknote 확장(Nova·GC·MIRIVA·Realty). → **p3 = AX 4항목 ~95% 채움**(공백 해소). ④ 그 결과 p4 끝 footer note(`givepro91.github.io/cv` 링크 줄)가 혼자 p5로 넘어가 거의 빈 페이지 발생 → **footer note 제거**(1p 콜아웃·헤더의 givepro91.github.io와 중복, Working Principle로 끝나는 게 더 강한 마무리). 링크 6→5(잃은 건 /cv, 포폴 홈 링크는 유지). ⑤ print 간격 추가 압축(.r-block 8px 등, print.astro 스코프). **검증**: A4 4쪽·링크 5·항목/섹션 무분할·p1·p3 채움·빈 페이지 없음. 남은 여백 = p2 하단(Experience→AX 경계, AX가 r-keep ~80%라 p2 잔여 40%에 못 들어감) — clean break 트레이드오프.
> 🟢 **(최종 보강) 페이지 전환 분할 전부 제거 — A4 4페이지, 모든 섹션 통째.** 사용자가 3→4 전환(Projects의 Landbook이 다음 장으로 넘어감)도 지적 → **AX·Projects 블록 둘 다 `r-keep`(통째 유지) + 딥다이브 간격을 print.astro 스코프 @media print에 직접 압축**(중요: 스코프 스타일이 global.css보다 우선순위 높아 global의 압축이 안 먹고 있었음 — 그래서 print.astro 스코프에 넣어야 실제로 먹음). 결과: **p3 = AI Agent Ops(Nova·GC·MIRIVA) + 제품 백엔드(PlanReview·PlanNext·Landbook) 전부 한 페이지 통째(≈95% 채움)**, p4 = Education·Learning·Working Principle. 남은 여백 = p2 하단(Experience→딥다이브 경계, ≈35%)·p4(마지막 장) — 둘 다 정상. 검증: A4 4쪽·링크 6·전 항목/섹션 무분할.
> 🟢 **(이번 세션 최종, 미커밋·배포대기) 인쇄 페이지네이션 + 레이아웃 마감까지 완료 — A4 4페이지·클린 분할·1페이지 채움.** 사용자 후속 피드백 반영: ① **A4 무조건 고정** = `@page{size:A4;margin:0}`(global.css + print.astro 스코프). ⚠️ 그동안 검증이 Letter(헤드리스 기본)라 실제 ⌘P(A4)와 페이지나뉨이 달랐음 — 이제 일치. ② **항목이 페이지를 가르지 않게** = `.r-job`/`.r-skillgrid`/`.r-skillrow`/`.r-vision` + bullet들 `break-inside:avoid` 복구·확장(스페이스워크·MIRIVA·Leadership 행 분할 해결). ③ **AX 블록 통째 유지** = `.r-keep{break-inside:avoid}` 클래스를 AX 섹션에 부여(헤딩+Nova만 남고 GC/MIRIVA가 넘어가던 것 해결). (Projects 블록도 이후 r-keep으로 — 최종 보강 줄 참고). ④ **1페이지 공백 채움** = CORE SKILLS를 HIGHLIGHTS 바로 뒤(Experience 앞)로 이동 → p1='요약+콜아웃+Highlights+Skills'로 알참(시니어 이력서 흔한 구성). ⑤ **스페이스워크 GC/Nova 중복 제거** = Experience 6→5 bullet, GC·Nova 상세 2줄을 "AI Agent Ops 한 줄(상세는 아래)"로 압축(AX 섹션이 상세 어필하니 중복 방지). ⑥ 인쇄 간격 압축(.resume padding 11mm, .r-block margin 9px 등). **검증**: A4 4쪽(`pdfinfo` Page size A4)·링크 6·항목 무분할·p1 채움·외톨이 마지막장 없음. **사용자 4 vs 5페이지 질문엔 처음 5p 택했으나, 이후 레이아웃 개선으로 4p 클린 달성.** **다음 = 사용자 로컬 ⌘P 확인 → 승인 시 5파일 커밋·푸시.**
> 🟡 **(이번 세션 중반) 이력서 PDF `/cv/print/` 마감 개선 4건 + 스페이스워크 경력 보강 — 빌드·PDF·web 검증 완료, 4페이지·클릭링크 6.** ① 브라우저 인쇄 헤더/푸터 제거 = `@page{margin:0}`+`.resume` padding(13/15mm)로 전환(global.css+print.astro, 포폴과 동일). ② 헤더 연락처·콜아웃·하단 URL 클릭링크화(`.r-link`, mailto/github/포폴/field-guide/cv = 6 Annotation). ③ VISION→"일하는 방식 · Working Principle"(cv.json VISION 톤 교체, "성장하겠습니다" 제거 — web `/cv/` body에도 반영). ④ CORE SKILLS = 한 덩어리→6 카테고리 인라인(`SKILL_GROUPS` print-local, `.r-skillgrid`, 뱃지 X). **+ 사용자 추가요청**: 스페이스워크 Experience가 너무 얇음 → 정본(`social-portfolio-os/strategy`)+Work콘텐츠+TeamSPWK GitHub로 사실확인 후 **6 bullet로 보강(AI/AX 우선: PlanReview·PlanNext.AI·Ground Control·Nova → Landbook 토대 → 팀리딩)**, PDF는 `current` 직장만 전체노출. PlanReview를 PROJECTS 최상단 신규추가, AX블록 "직접 빌딩 개인" → "AI Agent Ops·운영 자동화—직접 설계·구현(사내 GC~OSS Nova)" 리프레임, Landbook 비중↓(종료 명시 X)·큐피커 회사PROJECTS서 제거(피플리 경력엔 유지). ⚠️ 내부 IP/호스트(gc.spacewalk.dev 등) 공개이력서 제외. **다음 = 사용자 로컬확인→승인시 4파일 커밋·푸시.**
> ✅ **배포 완료 — 포트폴리오 PDF `/portfolio/print/` 라이브(`c616382`, Actions success, 200 검증).** 제출용 가로 A4 덱 10쪽: 표지→Why me→Profile→Case5(GC·Nova·Landbook·Realty·Zippit)→Other Works(Proof Table)→Contact/CTA. 라이트+브랜드블루, 데이터 도식+실제 화면(브라우저 프레임+콜아웃 2), 클릭 링크. /cv/·홈에 진입 버튼. **사용자 PDF 받는 법**: givepro91.github.io/portfolio/print/ → ⌘P(가로·배경그래픽 ON). 마지막 페이지=Contact/CTA 유지(A 권장 채택). 직전 도식 수정(▼ 가운데·flow 한 줄)도 포함.
> 🔧 **(직전) 도식 디테일 2개 수정 — 배포에 포함.** ① before/after 구분 `▼`(`.ba-sep`)가 far-left라 어색 → `align-self:center`로 가운데. ② flow 마지막 노드만 줄넘김+화살표 댕글링 → **화살표+노드를 `.dgm-step`(inline-flex)로 한 단위로 묶고** 노드 크기 축소(font 10.5·padding 5/9) → 4노드가 한 줄에 깔끔, 줄바꿈 시 "→ 노드"가 함께 이동. realty·landbook 렌더 육안 OK. 10쪽 유지. **미결 질문: 마지막 Contact/CTA 페이지(감사 인사 아님, 이미 CTA형) 유지 여부 — A 유지(권장)/B 철학문장 빼기/C 제거. 정하면 배포.**
> ✅ **포트폴리오 PDF 완성형(미커밋, 배포 대기). GC 다듬은 풀 treatment를 5개 케이스 전부에 롤아웃 완료.** 각 케이스 = 도식(loop/gate/ba) + 핵심 증거 3(설계원칙 톤) + `PRINCIPLE` quote(보더형) + 짧은 `ROLE` + **실제 스크린샷(`SHOT` 맵: url·label·pins 2개 콜아웃, `.proof` 브라우저 프레임, cover-top)** + 경량 본문(`decisionLog.slice(0, shots?0:2)`로 이미지 페이지는 결정로그 bullet 제거). GC만 `PROBLEM`/`INSIGHT` override(날카로운 OVERVIEW·짧은 insight). 데이터 맵: `FLOW·EVID·ROLE·PRINCIPLE·SHOT`(+GC전용 `PROBLEM·INSIGHT`). proof 블록은 `shots.length>0 && sh` 일반조건. **검증**: build OK, preview(4399) 10쪽, 클릭 링크 16, pdftoppm로 GC·Zippit·Landbook·Realty 케이스 육안 OK(랜딩도 cover-top 깔끔). GPT 평가 80점대 후반. **다음 = 배포 승인 대기.**
> 🎯 **(이전) GC 케이스 = GPT 3차 피드백 5개 반영.** ① 우측 본문 경량화로 스크린샷 위 여백 확보 ② `PRINCIPLE` 맵 추가 → 좌패널 증거 아래 "DESIGN PRINCIPLE: 기본값은 공개 알림이 아니라 조용한 확인으로 설계" ③ `decisionLog.slice(0, shots?0:2)` — 이미지 페이지는 좌측 증거와 중복되는 결정로그 bullet 제거 ④ `.proof-pins` 패딩 `22px 12px 15px`(콜아웃 위로)+배경 진하게 ⑤ 역할 한 줄 유지. GPT 평가 "80점대 후반". 10쪽 유지. **다음: 이 풀 treatment(실제스샷+콜아웃+principle+증거 설계원칙화+본문경량화)를 nova·landbook·realty·zippit에 롤아웃? 그 뒤 배포.**
> ✨ **GC 케이스 = 증거 '읽히게' 다듬음 완료(GPT 2차 피드백 5개 반영, 미커밋).** ① 스크린샷 `max-height:210px`로 키움 + `.proof-pins` 콜아웃 2개(실시간 관측 16/16 · 신뢰도 언어 3단계·담당자 DM) → 지표 읽힘 ② `EVID[ground-control]`를 "0" KPI풍 → **설계 원칙 문구**(퍼센트 신뢰도 제거·공개채널 기본 차단·피드백 루프 내장) ③ `decisionLog.slice(0, shots.length?1:2)`(이미지 페이지는 본문↓) + `INSIGHT` 오버라이드 맵으로 GC insight 축약 ④ figcaption "EVIDENCE · {title} 운영 대시보드 / 민감 정보 마스킹" ⑤ `ROLE` 맵으로 역할 한 줄(플로우 중복 제거). 10쪽 유지. **다음 결정: 이 treatment(실제 스크린샷+콜아웃+ROLE/EVID 다듬기)를 나머지 4개 케이스(nova·landbook·realty·zippit)에 롤아웃할지 → 그 뒤 배포.** ROLE은 5개 다 정의됨, 스크린샷·콜아웃·EVID문구는 GC만 다듬음(나머지는 기존).
> 🧩 **증거 스냅샷 = 실제 화면(이전 메모).** ⚠️ 핵심 정정: 사용자가 "크롭 스크린샷 금지"라 했던 건 *조잡한 크롭/페이드/dominant* 처리가 싫다는 뜻이었고, **증거로는 실제 사진(제품 캡처)을 원함**(CSS 목업 X). → CSS DM 목업 폐기, **`galleries.work[slug]` 실제 스크린샷을 `.proof` 브라우저 프레임**(점3개+URL필 `gc.spacewalk.dev`, `img object-fit:cover top·max-h150px`, 캡션 "실제 운영 화면(민감 마스킹)")에 담아 GC 케이스 우측 하단 여백에 추가. 깔끔한 프레임 = OK, 조잡 크롭 = NG. `slugOf==="ground-control" && shots.length>0` 조건부. 10쪽 유지. **사용자 판단 중: A 5개 케이스 전부 실제화면 프레임(landbook·zippit는 랜딩이라 cover-top이 텍스트 자를 수 있음→contain 검토) / B GC만 / C 빼기.** galleries.work 키 다 있음(gc·nova·miriva·zippit·landbook-msa·realty 등).
> 📈 **포트폴리오 v5 — GPT 외부 피드백 전면 반영(미커밋, 배포 대기).** 사용자가 GPT 10p 리뷰 전달 → 반영: ① **페이지표기 정확(10쪽, NN/10)** ② **URL을 클릭가능 `<a href>`로**(pdfinfo -url에 16 Annotation 확인) ③ 케이스 6→**핵심5 전면 + Other Works/Proof Table**(MIRIVA는 [DISCOVERY] 분리) ④ 블루패널 빈공간에 **핵심 증거 3개**(`EVID` 맵, 사실 기반) ⑤ s-top nav→**섹션·CASE·축** ⑥ **Why me를 p2 executive summary로**(강점3+증거) ⑦ 순서=표지→Why→Profile→Case5→Other→Contact ⑧ 직무형 헤드라인+AX 풀어쓰기+대표링크 주인공 ⑨ Thank you→**CTA 카드 3개**(결정로그/Field Guide/메일) ⑩ Profile에 EXPERTISE 영역별 성과 ⑪ print min-height 191mm로 페이지 채움. **검증**: build OK, preview(4399) 10쪽, pdftoppm로 표지·why·case·other 육안 OK. **미해결(사용자 판단)**: GPT가 "실제 산출물 이미지 1개" 권했으나 사용자가 크롭 스크린샷 금지 → 다이어그램+증거칩으로 대체(스크린샷 안 넣음).
> 🎨 **진행 중(미커밋, 방향확인+배포 대기) — 포트폴리오 PDF `/portfolio/print/` 를 5라운드 피드백 끝에 또 from-scratch 재설계(v4, 현재본).** 사용자 결정타 피드백(→ `~/.claude/.../memory/feedback-portfolio-pdf.md` 저장): ① **크롭한 제품 스크린샷 절대 쓰지 마라**("진짜 별로") → **직접 그린 데이터 도식**(플로우/before-after)으로 대체 ② **내용이 알차야 포폴**(구조 가이드 제공) ③ 톤 레퍼런스 = **라이트 + 브랜드 블루, 깔끔 구조형 한국 채용 포폴**(사용자가 이미지3장 줌 — 특히 좌 블루패널+도식 / 우 Overview+리서치 차트). 이전 4안(세로/이미지cover/저투명배경/그린 에디토리얼)은 전부 폐기.
> **현재 디자인(v4) = 라이트+블루 구조형**: 토큰 `--blue:#2563eb`(브랜드)·`--bg:#fff`·`--bg-2:#f4f7fc`·잉크 `#18233a`·Pretendard+JetBrains Mono. **케이스 = 이미지8 레이아웃**: 좌 블루 그라데이션 패널(CASE번호+title+What+**FLOW 도식**+사이드바 역할/기간/Tools) / 우 흰판(OVERVIEW·왜=problem → 판단·어떻게=decision+decisionLog trade-off → 결과·IMPACT=result 강조박스 → INSIGHT=learning). 도식 데이터 = 프론트매터 `FLOW` 맵(kind: loop/gate/flow/ba, nodes/gate/cap). **제품 갤러리 이미지 미사용**(프로필 사진만 OK). 10쪽: 표지(요약+nav탭) → Profile(카드+CAREER+STRENGTHS+SKILLS) → 케이스6 → Why me(강점3 두괄식) → Thank you. **검증**: 10쪽, pdftoppm로 표지·Profile·Ground Control 케이스 렌더 육안 OK(레퍼런스와 정합).
> ⚠️ **반복 함정(매번 밟음)**: ① **stale dev(4321)** HMR 깨져 무스타일 렌더 → **검증은 `pnpm build` 후 `astro preview`(=4399)에서**. ② **`@media (max-width:760px)`는 반드시 `@media screen and`**(인쇄 2단→1단 붕괴 방지). ③ print `min-height:173mm; padding:12mm 14mm`(합>210mm면 푸터 샘).
> ✅ **배포 완료 — `b059aa9` (`feat(cv,roadmap)`), Actions success, 라이브 4페이지(/, /cv/, /cv/print/, /roadmap/) 200 검증.** 이번 세션 = **AX 포지션 지원용 CV/Work 적대적 평가 + 전면 개선 + 공개 로드맵 페이지**, 모두 라이브.
> **무엇을 했나:** ① 평가 — "소재(Work)는 강한데 제출 PDF가 백엔드 이력서로 읽히고 라이브 자산 링크가 묻힘"이 핵심 갭. ② **P0** AX 시그니처(Nova·GC·MIRIVA) CV 편입 + 라이브 자산 콜아웃(PDF 1p 밴드). ③ **P1** Career 다이어트(PDF, featured만 풀) + Lectures→Learning + 이해관계자 커뮤니케이션(사실 기반, 경영진 보고는 미주장). ④ **P2** summary 첫 문장 AX화(백엔드=토대 유지). ⑤ **피드백** Overview·NOW 단락 분리(`\n\n` split, 가독성) + PDF에 Vision(동기·포부) 추가로 4장 채움 + 한국어 래핑은 body 상속이라 누락 없음 확인. ⑥ **Roadmap** 공개 `/roadmap/` 신설(시장 좌표→현재 위치[Work 링크]→깊게 파는 중→다음 분기, 전진 서사). ⑦ 국내 AX 시장 리서치 2건(출처 포함, 요약은 채팅).
> **미해결/참고:** 로컬 dev 서버 `astro dev :4321` 아직 기동 중(사용자 열람용) — 세션 끝나면 `pkill -f "astro dev"`. PDF 4쪽. work 상세 decision 블록(128~150자)은 라벨이 끊어줘 벽 아님 → 유지(원하면 분리 가능).

# Handoff — Keunsik Works · 이력서 PDF 마감 개선 + 스페이스워크 경력 보강 · main

## Restore in 30s — 무엇을/어디까지/방금 끝낸 것
**Keunsik Works** = 장근식(@givepro91) 공개 포트폴리오 + CV. Astro 정적 → 라이브 https://givepro91.github.io. **제출 산출물 = `/cv/print/` 를 ⌘P로 PDF 저장.** 데이터 SoT = `src/data/cv.json`(`cv.ts` 타입 re-export). 정체성·포지셔닝 정본 = `jay-swk/social-portfolio-os/strategy`(읽음), Work 콘텐츠 = `src/content/projects/ko/*.md`(anon/riskChecked = 공개안전 버전).
- **이번 세션 = 사용자 요청 이력서 PDF 개선 4건 + 추가요청(스페이스워크 경력 보강). 전부 빌드·PDF(headless)·web dist 검증 완료, 미커밋·배포대기.**
  1. **브라우저 인쇄 헤더/푸터 제거** — `@page{margin:0}`(global.css 969 + print.astro 스코프) + `.resume` padding 13/15mm. 포폴 PDF와 동일 검증된 방식. (headless `--no-pdf-header-footer`로 생성했으므로 GUI ⌘P에서 헤더 0 여부는 **사용자 ⌘P 미리보기로 최종확인 필요** — 기법상 안 나옴.)
  2. **클릭 링크** — 헤더 연락처·콜아웃 URL·하단 cv 링크를 `<a>`로. `pdfinfo -url` = **6 Annotation**(mailto·github·givepro91.github.io×2·ax-field-guide·cv).
  3. **VISION → 일하는 방식 · Working Principle** — print 헤딩 변경 + `cv.json` VISION headline/body 톤 교체(원칙형, "성장하겠습니다" 제거). web `/cv/`는 데이터 공유라 body 자동반영(단, web 섹션 헤딩은 "Value & Vision" 그대로 — 스코프상 미변경).
  4. **CORE SKILLS** — `skillLine` 한 덩어리 → print-local `SKILL_GROUPS` 6 카테고리 인라인(`.r-skillgrid`). 뱃지 X, 텍스트추출 OK.
  5. **(추가) 스페이스워크 Experience 보강** — `cv.json` CAREER[0] summary AX화 + highlights 5→**6**(PlanReview·PlanNext.AI·Ground Control·Nova → Landbook 토대 → 팀리딩). PDF는 `c.current` 직장만 전체 bullet, 나머지 slice(0,3). PROJECTS에 **PlanReview 신규 최상단**, Landbook+가로주택 1개로 병합·하단(종료 명시 X), 큐피커 제거. AX블록 헤딩/blocknote를 "직접 빌딩 개인" → "AI Agent Ops·운영 자동화 — 직접 설계·구현"으로 리프레임(print.astro + cv/index.astro projectGroups 라벨).

## Next steps — 구체적 다음 행동
- [ ] **사용자 로컬 확인** — `pnpm build && pnpm exec astro preview` → `localhost:<port>/cv/print/` → ⌘P(여백 "기본값" 유지, 미리보기에서 상단 날짜/하단 URL 사라졌는지 확인).
- [ ] **승인 시 커밋·푸시(=라이브)** — **명시 경로만**: `git add src/data/cv.json src/pages/cv/index.astro src/pages/cv/print.astro src/styles/global.css docs/handoff/main.md` → commit(예: `feat(cv): 이력서 PDF 마감 개선 + 스페이스워크 경력 보강`) → push → Actions success → `/cv/print/`·`/cv/` 200 확인.
- [ ] (옵션) 사용자 확인 요청한 **MIRIVA 톤** — AX블록에 "직접 설계·구현"으로만 표기(사내 공식제품 단정 X). GC는 TeamSPWK `swk-ground-control`=사내 관제플랫폼으로 확인돼 사내업무 명시. 괜찮은지 피드백 대기.
- [ ] (옵션) PlanReview를 **Work 페이지 카드로 더 부각** — 현재 `src/content/projects/ko/planreview.md` `order:5`, featured 없음. 홈 Work 노출 키우려면 order/featured 조정.
- [참고·최신] 페이지네이션 최종: 항목 무분할(`.r-job` 등 break-inside:avoid) + AX 섹션 통째(`.r-keep`) + CORE SKILLS를 p1로 이동 + GC/Nova Experience 압축(5 bullet) + A4 고정 → **A4 4페이지 클린**. (중간에 break 해제→4p 시도했으나 항목 분할 생겨 사용자가 거부 → 분할방지로 회귀 후 레이아웃으로 4p 달성.)

## Touch points — path:line · 검증
- `src/styles/global.css` print블록 — `@page{size:A4;margin:0}` · `.resume` padding 11mm 15mm · break-inside:avoid 목록(`.r-job`/`.r-job-mini`/`.r-edu`/`.r-proj`/`.r-callout`/`.r-skillgrid`/`.r-skillrow`/`.r-vision`/li들) + `.r-keep{break-inside:avoid}` · 인쇄 압축(.r-block margin 9px 등). ⚠️ 포폴은 자체 `@page{size:A4 landscape;margin:0}`(portfolio/print.astro:420)이라 무영향.
- `src/pages/cv/print.astro` — frontmatter `SKILL_GROUPS`(SKILLS import 제거) · `.r-link`/`.r-skillgrid` 스타일 · `c.current?전체:slice(0,3)` · CORE SKILLS 섹션을 HIGHLIGHTS 뒤로 이동 · AX 섹션에 `r-keep` 클래스 · 헤딩 2개 리프레임 · `@media print{@page{size:A4;margin:0}; .resume padding 11mm; .r-vision 압축}`.
- `src/data/cv.json` — CAREER[0](스페이스워크) summary+6 highlights+stack · PROJECTS 재구성(PlanReview/PlanNext/Landbook병합, 큐피커 제거) · VISION headline/body.
- `src/pages/cv/index.astro:11-13` projectGroups 라벨/note 리프레임.
- **검증 → 기대**: `pnpm run build`=BUILD OK · `astro preview` 후 headless `--print-to-pdf` → `pdfinfo` **Pages:4** · `pdfinfo -url | grep -c http\|mailto` **6** · `pdftotext`로 PlanReview/PlanNext.AI/Ground Control/Nova/가로주택정비/일하는 방식 추출됨 · `git status --short` = 위 5파일만.

## Decisions
- 헤더/푸터 제거 = `@page{margin:0}`+content padding(포폴 선례) — non-zero 마진은 GUI 헤더 영역을 못 막음.
- GC·Nova·MIRIVA = 사용자 결정 "스페이스워크 업무로 편입" → Experience 본문에 직접 명명 + AX블록 "개인" 라벨 제거. (정본도 GC/Nova를 TeamSPWK 업무로 서술.)
- Landbook = 사용자 결정 "비중만 낮추기"(종료 명시 X) — AI 제품 아래로, "백엔드 토대"로.
- 공개안전: 내부 IP·호스트·고객/리소스명은 이력서에서 제외(정본 규칙), anon Work 콘텐츠 기준으로만 서술.
- 페이지네이션 원칙(사용자 명시): 항목은 물론 섹션도 페이지를 가르지 않는다(분할 금지) > 페이지 꽉 채우기. AX·Projects 둘 다 `.r-keep`(통째). 두 딥다이브 블록이 한 페이지(p3)에 함께 들어가도록 print.astro 스코프 @media print에서 딥다이브 간격(.r-proj/.r-job-sum/bullet/.r-blocknote) 압축 — ⚠️ 스코프 스타일 우선순위 때문에 global.css 압축은 안 먹으니 반드시 print.astro 스코프에 넣을 것.
- CORE SKILLS를 상단(요약 직후)으로 — p1 공백 해소 + "요약→핵심역량→스킬→경력" 시니어 구성. A4 무조건 고정(`@page size:A4`) — 검증=실제 ⌘P 출력 일치.
- 스페이스워크 Experience에서 GC·Nova는 한 줄로 압축 — AX Agent Ops 섹션이 상세 어필하므로 중복 제거(사용자 요청).

---

# Handoff(이전 세션) — Keunsik Works · AX 포지션용 CV P0 개선(AX 프로젝트 편입 + 라이브 자산 콜아웃) · main

## Restore in 30s — 무엇을/어디까지/방금 끝낸 것
**Keunsik Works** = 장근식(@givepro91) 공개 포트폴리오 + CV. Astro 정적 → 라이브 https://givepro91.github.io. 정체성=`AX Product · Engineering Lead`. **제출 산출물 = `/cv/print/` 페이지를 ⌘P로 PDF 저장.**
- **데이터 SoT**: 이력서 텍스트=`src/data/cv.json`(`cv.ts`는 타입 re-export) · 제품 이미지=`src/data/galleries.json`(key=cv는 project name).
- **이번 세션 P0 2건 완료(빌드·PDF·스크린샷 검증, 미커밋):**
  1. **AX 시그니처 3개를 CV에 정식 편입** — `cv.json`에 신규 `AX_PROJECTS` 배열(Nova·Ground Control·MIRIVA)을 AX 채용 관점으로 재서술. web `/cv/` Projects를 2그룹("AI Agent Ops · 직접 빌딩" 위 → "대표 프로젝트 · 회사" 아래), PDF `/cv/print/`도 "AX · AI Agent Ops" 블록을 회사 Key Projects **앞**에 배치. AX 프로젝트 썸네일도 연결(work 스크린샷 재사용).
  2. **라이브 자산 콜아웃 신설** — givepro91.github.io + ax-field-guide.vercel.app로 가는 진입점. web=info 카드 아래 2장 카드, **PDF=요약 직후 1페이지 상단 녹색 보더 밴드**(회색 링크로 묻히던 문제 해결). `ax-field-guide`는 이전엔 사이트·CV·repo 연결 0건이었음 → PROFILE.links에도 추가.
- **P1 3건 완료(빌드·PDF·스크린샷 검증, 미커밋):**
  3. **Career 다이어트(PDF 전용)** — `cv.json`에서 스페이스워크·피플리에 `featured:true`. `print.astro` 분기를 `highlights.length>=2` → `c.featured`로 변경 → 대표 2개만 풀 디테일, 나머지 6개사(태전약품~청주교차로)는 1줄 mini. **web `/cv/`는 의도적으로 손 안 댐(상세 위키 성격).**
  4. **Lectures → "Learning · 학습과 공유" 재프레이밍** — web·print 양쪽 heading 변경 + lead note("온라인 강의로 익히고 블로그·AX Field Guide로 정리·공유 — 학습을 자산으로"). web TOC 라벨도 Lectures→Learning. (display는 원래 "Lectures"였고 "Awards" 노출은 없었음 — 강의를 학습의지+커뮤니케이션 자격으로 reframe.)
  5. **이해관계자 커뮤니케이션 보강(자격 갭)** — PDF: HIGHLIGHTS 마지막 항목을 "기술 배경 다른 현업·공공기관 이해관계자와 같은 언어로…"로 수정 + print slice(0,6)→(0,7)로 노출. web: CASES에 "복잡한 기술을 이해관계자 언어로 — 현업·공공기관 협업" 추가. **모두 문서화된 사실 기반(LH 공공기관·도메인 언어 모델링·팀 리딩) — 경영진 보고는 근거 부족이라 의도적으로 미주장.**
- **P2 완료(빌드·PDF 검증, 미커밋):**
  6. **summary 첫 문장 AX화** — `cv.json` PROFILE.summary 첫 문장을 "10년차 백엔드·프로덕트 리드…" → "**AI를 붙이는 게 아니라, AI가 안전하게 일할 수 있는 운영 구조를 설계하는 AX 리드입니다**"(홈 히어로 톤 echo). 백엔드는 "10년차 백엔드 엔지니어링을 토대로"로 유지(버린 게 아니라 토대 — 정체성 규칙 준수). summary는 web·PDF 공유라 한 곳 수정으로 양쪽 반영.
- **검증됨**: `pnpm run build` PASS, PDF **4쪽 유지**(Career 다이어트가 +highlight/learning note/AX 추가분 상쇄, 페이지당 밀도↓ = "빼곡함" 완화), 새 summary 첫 문장 PDF 1p 상단 확인, 콜아웃 1p·AX 2~3p, 인쇄 break로 카드 미분할. Career mini 6개사 1줄 렌더 스크린샷 확인.

## Next steps
- [x] **포트폴리오 PDF 배포 완료** — `c616382` push→main, Actions 28077161140 success, 라이브 `/portfolio/print/`·`/cv/`·`/` 200 검증. (이 핸드오프는 별도 docs 커밋.)
- [ ] **사용자: 제출용 PDF 받기** — 라이브 `givepro91.github.io/portfolio/print/`(포트폴리오, 가로) + `/cv/print/`(이력서, 세로) → ⌘P 저장.
- [ ] (옵션) 케이스별 콜아웃/EVID 문구가 어색하면 `SHOT`/`EVID`/`PRINCIPLE` 맵에서 수정. Other Works 표·Why me 카피도 조정 가능.
- [구 항목 ↓ 참고용]
- [ ] ~~포트폴리오 PDF 배포 승인 대기~~ — 사용자가 로컬(http://localhost:4321/portfolio/print/) 확인 후 OK 하면 커밋·푸시. **명시 경로만**: `git add src/pages/portfolio/print.astro src/pages/cv/index.astro src/pages/index.astro src/styles/global.css docs/handoff/main.md` → commit(예: `feat(portfolio): 제출용 포트폴리오 PDF — 가로 슬라이드 덱`) → push(=라이브) → `/portfolio/print/` 200 확인. (조정 여지: 색감·여백·문구·프로젝트 선정/순서.)
- [참고] **PDF 저장 시 가로** — `@page{size:A4 landscape}` 적용돼 인쇄 대화상자가 가로 자동선택. 세로면 사용자가 가로로.
- [x] **배포 완료(이전)** — `b059aa9` push→main, Actions 28069281814 success, 라이브 4페이지(/, /cv/, /cv/print/, /roadmap/) 200 검증.
- [ ] **사용자: 새 PDF 다운로드** — 라이브 `givepro91.github.io/cv/print/`(이력서) + (배포 후) `/portfolio/print/`(포트폴리오, 가로) → ⌘P 저장.
- [ ] (옵션) work 상세 `선택·결정` 블록(128~150자) 단락 분리 — 사용자가 권장(유지) 택해 현재 보류.
- [ ] (옵션) 채팅의 AX 시장 리서치 2건을 `docs/`나 wiki로 영구 보관(현재는 대화에만 존재).
- [참고] **로컬 dev 서버** — `astro dev --port 4321` 아직 기동 중(bg, 로그 /tmp/claude-501/devserver.log). 세션 종료 시 `pkill -f "astro dev"`.

## Touch points
- `src/data/cv.json` — 신규 `AX_PROJECTS`(Nova·Ground Control·MIRIVA, 각 metrics/overview/achievements/stack/workSlug) + PROFILE.links에 `AX Field Guide` 추가. **[P1]** 스페이스워크·피플리에 `featured:true`, HIGHLIGHTS 마지막 항목을 이해관계자 커뮤니케이션으로 수정, CASES에 "복잡한 기술을 이해관계자 언어로" 케이스 추가.
- `src/data/cv.ts` — `ProjectEntry`에 `metrics?` 추가, `export const AX_PROJECTS = cv.AX_PROJECTS as ProjectEntry[]`. **[P1]** `CareerEntry`에 `featured?: boolean` 추가.
- `src/data/galleries.json` — cv.{Nova,Ground Control,MIRIVA} = work 스크린샷 재사용(/og/scr-...svyq·stua·swwz.png).
- `src/pages/cv/index.astro` — frontmatter `projectGroups`(AX 먼저), `.cv-callout` 박스(info 카드 뒤), Projects 섹션 그룹 루프(`.cv-proj-group`/`.cv-subhead`), entry head에 `p.metrics` 표시. **[P1]** TOC·heading "07 Lectures"→"07 Learning · 학습과 공유" + sec-note. (web Career·CASES는 데이터 변경분이 자동 반영 — 템플릿 무변경.)
- `src/pages/cv/print.astro` — `AX_PROJECTS` import, 요약 뒤 `.r-callout` 밴드, "AX · AI Agent Ops" `.r-block` + 회사 "Key Projects"(둘 다 achievements `.slice(0,2)`), scoped 스타일 `.r-callout*`·`.r-blocknote`. **[P1]** `detailed/mini` 분기를 `c.featured` 기준으로, HIGHLIGHTS `.slice(0,7)`, "Lectures · 강의"→"Learning · 학습과 공유" + `.r-blocknote` lead. **[피드백]** `PROFILE.summary.split("\n\n").map`(3단락) + `VISION` import해 "지향 · Vision" `.r-block`을 Learning 뒤·r-note 앞에 추가(scoped `.r-vision-q`/`.r-vision-p`, `.r-summary + .r-summary` 간격).
- **summary 단락 규약**: `cv.json` PROFILE.summary는 **string 유지**, 단락 구분은 문자열 안 `\n\n`. web `.cv-lead`·print `.r-summary` 둘 다 `split("\n\n").map`. (배열로 안 바꾼 이유 = admin/타입 호환.) `.cv-lead + .cv-lead{margin-top:11px}`(global.css).
- `src/styles/global.css` — `.cv-callout*`·`.cv-proj-group`·`.cv-subhead`·`.cv-subnote`(.cv-links 뒤) + 인쇄 break에 `.r-proj,.r-callout` break-inside·`.r-blocknote` break-after 추가(라인 ~963). **[Roadmap]** `.sec-note-link`(.sec-note 뒤). **[Portfolio]** `.pdf-btn.ghost`·`.cv-docs`(.pdf-btn:hover 뒤) — cv 헤더/푸터 2버튼.
- **[Portfolio 페이지]** `src/pages/portfolio/print.astro`(신규, **v4 = 라이트+블루 구조형, 현재본**) — `/portfolio/print/`. import: `PROFILE, CAREER, SKILLS, HIGHLIGHTS`(cv) + projects collection. 프론트매터: `DEEP`(케이스6 슬러그), `AXIS`(theme→라벨), **`FLOW`(슬러그→도식 데이터: kind loop/gate/flow/ba, nodes, gate인덱스, cap)**, `detailed`=featured 경력, `totalPages`. 슬라이드: `.cover`(요약+nav탭) / Profile(`.prof` 2열: `.prof-card`+`.prof-main`(CAREER·CORE STRENGTHS·SKILLS)) / `.case`(`.case-grid` 2열: `.case-panel` 블루그라데이션[case-no·title·`.case-what`·`.dgm`도식·`.case-side`] + `.case-detail`[`.cd-blk`×4: OVERVIEW·판단(+`.cd-log` trade-off)·결과(impact)·INSIGHT]) / `.why`(강점3) / `.thanks`. 도식 렌더는 case map 안 인라인(kind ba면 before/after, 아니면 nodes+arrow, gate면 하이라이트). **제품 스크린샷 미사용**. `src/pages/cv/index.astro`·`index.astro`·`global.css`는 이력서/포폴 PDF 2버튼·홈링크·.cv-docs/.pdf-btn.ghost(이전 그대로). **검증**: `pnpm build` OK, `astro preview`(4399) `pdfinfo`→**10쪽**·841×595pt, `pdftoppm`로 표지·Profile·case 육안 OK. **⚠️ `@media screen and (max-width:760px)` 유지.**
- **[Roadmap 페이지]** `src/pages/roadmap.astro`(신규) — `/roadmap/`. 프론트매터 데이터(marketThemes·stand[market→Work slug]·deep·roadmap[when/title/why/what/proof]) + scoped 스타일(.rm-*, .stand-row, .rm-timeline). 기존 클래스 재사용(sec-head·now-card·chip·pill·reveal). 전진 서사 톤(약점 노출 X). `src/layouts/BaseLayout.astro` 네비에 `<a href="/roadmap/">Roadmap</a>`(Lab 뒤). `src/pages/index.astro` Now sec-note에 `/roadmap/` 링크. **근거 = 채팅의 2개 리서치 브리핑(국내 AX 시장 + 역량/로드맵, 출처 포함).**
- **검증 명령 → 기대**: `pnpm run build` → PASS+disclosure PASS. PDF = `astro preview --port 4488` 후 `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --print-to-pdf=/tmp/x.pdf http://localhost:4488/cv/print/` → `pdfinfo` **Pages: 4**. `git status --short` → 위 6개 파일만(레포 오염 없음, PDF/png는 /tmp).

## Decisions
- AX 프로젝트를 회사 PROJECTS에 섞지 않고 **별도 `AX_PROJECTS` 그룹**으로 — "직접 빌딩한 AX" 신호를 분리해 강조(회사=PropTech 백엔드 vs 개인=Agent Ops 대비).
- 콜아웃을 web·print **양쪽에 별도 구현** — PDF가 실제 제출물이라 회색 링크 한 줄로는 놓침. print는 1p 상단 밴드로 못박음.
- PDF 3→4쪽 허용 — 회사 achievement 3→2 축소로 페이지당 밀도를 낮춰 "빼곡함" 우려와 정합. 4쪽은 정상분량(고아 아님)으로 확인.
- "빼곡함"의 구조적 해소(Career 다이어트·Lectures 리네임)는 P1에서 처리 — 사용자가 P0 후 "계속 P1 진행" 요청.
- **[P1]** Career 다이어트는 **PDF에만** 적용 — web `/cv/`는 "상세 위키"가 의도라 전체 디테일 유지. `featured` 플래그로 표면별 분기.
- **[P1]** 커뮤니케이션 보강은 **사실 기반만** — LH 공공기관·도메인 언어 모델링·팀 리딩은 문서화돼 있어 주장, "경영진 보고"는 근거 없어 미주장(과장 금지).
- **[P2]** summary 첫 문장 AX화 시 백엔드는 "토대"로 유지 — 정체성 규칙(백엔드 단정 금지, "버린 게 아니라 확장") 준수. PROFILE.title("AX Product · Engineering Lead")은 이미 적합해 무변경.
- **[Portfolio·결정타]** 5라운드 끝 사용자 명확화(메모리 `feedback-portfolio-pdf.md`): **크롭 제품 스크린샷 금지 → 데이터 도식**, **내용 알참(What/Why/How/Skills/Tools/Insight + 구조 가이드)**, **라이트+브랜드블루 구조형 한국 채용 포폴**(레퍼런스 이미지 3장). → v4로 전면 재작성. 그린 에디토리얼·타이포덱·이미지배경 전부 폐기. 액센트=브랜드 블루 `#2563eb`. 도식은 `FLOW` 데이터로 케이스별 커스텀(스크린샷 대체).
