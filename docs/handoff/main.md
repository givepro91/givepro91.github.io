---
branch: main
status: active
updated: 2026-06-24T01:42:36Z
---
> ✅ **배포 완료 — `b059aa9` (`feat(cv,roadmap)`), Actions success, 라이브 4페이지(/, /cv/, /cv/print/, /roadmap/) 200 검증.** 이번 세션 = **AX 포지션 지원용 CV/Work 적대적 평가 + 전면 개선 + 공개 로드맵 페이지**, 모두 라이브.
> **무엇을 했나:** ① 평가 — "소재(Work)는 강한데 제출 PDF가 백엔드 이력서로 읽히고 라이브 자산 링크가 묻힘"이 핵심 갭. ② **P0** AX 시그니처(Nova·GC·MIRIVA) CV 편입 + 라이브 자산 콜아웃(PDF 1p 밴드). ③ **P1** Career 다이어트(PDF, featured만 풀) + Lectures→Learning + 이해관계자 커뮤니케이션(사실 기반, 경영진 보고는 미주장). ④ **P2** summary 첫 문장 AX화(백엔드=토대 유지). ⑤ **피드백** Overview·NOW 단락 분리(`\n\n` split, 가독성) + PDF에 Vision(동기·포부) 추가로 4장 채움 + 한국어 래핑은 body 상속이라 누락 없음 확인. ⑥ **Roadmap** 공개 `/roadmap/` 신설(시장 좌표→현재 위치[Work 링크]→깊게 파는 중→다음 분기, 전진 서사). ⑦ 국내 AX 시장 리서치 2건(출처 포함, 요약은 채팅).
> **미해결/참고:** 로컬 dev 서버 `astro dev :4321` 아직 기동 중(사용자 열람용) — 세션 끝나면 `pkill -f "astro dev"`. PDF 4쪽. work 상세 decision 블록(128~150자)은 라벨이 끊어줘 벽 아님 → 유지(원하면 분리 가능).

# Handoff — Keunsik Works · AX 포지션용 CV P0 개선(AX 프로젝트 편입 + 라이브 자산 콜아웃) · main

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
- [x] **배포 완료** — `b059aa9` push→main, Actions 28069281814 success, 라이브 4페이지 200 검증. (이 핸드오프는 별도 `docs(handoff)` 커밋.)
- [ ] **사용자: 새 PDF 다운로드** — 라이브 `givepro91.github.io/cv/print/` → "PDF로 저장/인쇄 ⌘P"(Chrome·A4·배경그래픽 ON) → 제출용으로 사용.
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
- `src/styles/global.css` — `.cv-callout*`·`.cv-proj-group`·`.cv-subhead`·`.cv-subnote`(.cv-links 뒤) + 인쇄 break에 `.r-proj,.r-callout` break-inside·`.r-blocknote` break-after 추가(라인 ~963). **[Roadmap]** `.sec-note-link`(.sec-note 뒤).
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
