---
branch: main
status: active
updated: 2026-06-23T00:41:55Z
---
# Handoff — Keunsik Works · CV의 AX 증거 보강 · main (givepro91.github.io)

## Restore in 30s — 무엇을/어디까지/방금 끝낸 것
**Keunsik Works** = 장근식(@givepro91) 공개 포트폴리오 + CV. Astro 정적, 라이브 https://givepro91.github.io. (이전 배치 = Clean Wiki 개편 + 리브랜드 + AX 리포지셔닝 + Lab/썸네일/favicon, 모두 **배포 완료**, 커밋 ~aef2933.)
- **이번 작업 = 1440px 전 화면 리뷰 + CV의 AX 증거 보강. working tree 미커밋·미배포. 빌드+게이트 PASS, 로컬 검증 완료. 사용자 "로컬 확인 후 배포" 선택 → 배포 승인 대기 중.**
- **리뷰 결과**: 가독성·위계 양호, 줄넘김 전 구간 정상(이전 `overflow-wrap:break-word` 유지), TOC 1440px 라벨 말줄임 정상. **핵심 발견 = CV 상단 서사(summary/Highlights/Vision)는 AX인데 본문 증거(Skills/Cases/Projects)가 100% 백엔드** → 신뢰 갭. home엔 Nova·MIRIVA·Ground Control·Realty Data 등 AX 서사 풍부한데 CV엔 0.
- **수정(`src/data/cv.ts`)**: ① SKILLS 맨 앞에 AX 2그룹 추가 — `AI · 에이전트 · AX`, `운영 자동화 · 데이터 신뢰성` (→ web 3×2 그리드, AX가 상단 행). ② CASES 맨 앞에 AX 사례 1건 — "AI 에이전트를 '실행'이 아니라 '통제'로 — 안전 운영 게이트"(생성/검증 분리·human-in-the-loop·**Nova는 개인 프로젝트로 정직 표기**). ③ `nameEn: "Jang Keunsik" → "Keun-sik Jang"`(리브랜드 때 cv.ts만 누락됐던 불일치, home/config과 일치).
- **수정(`src/pages/cv/print.astro`)**: SKILLS 추가로 Core Skills 라인이 길어져 footer만 4p로 밀린 orphan 발생 → scoped `@media print`에 `.r-skills{line-height:1.5}`·`.r-lectures li{margin-bottom:3px}`·`.r-note{margin-top:12px;padding-top:10px}` 추가 → **인쇄 3p 복귀**(pdfinfo Pages:3 검증, 화면 표시엔 무영향).
- 근거 출처: iCloud `jay-swk-pp`(strategy/·sources/·portfolio/) Explore 채굴 — Ground Control·Nova·BizAssistAI·Realty Data·PlanNext.AI 실제 커밋 기반. **비공개 내부명(BizAssistAI 등)은 SKILLS/CASES에서 제외**(home 공개 카드와 1:1 대응되는 것만 사용).

## Next steps
- [ ] **사용자 OK → 커밋 + 배포** — 명시경로 staging: `git add src/data/cv.ts src/pages/cv/print.astro` (+ 필요시 `docs/handoff/main.md`). `git add -A` 금지. push → Actions 자동 배포 → 라이브 마커 검증(Skills "AI · 에이전트 · AX" 노출, nameEn "Keun-sik Jang").
- [ ] (사용자 제기 가능) AX 사례를 첫 번째 말고 두 번째로 이동 등 문구·순서 미세조정 — 요청 시 cv.ts CASES 배열 순서만 변경.
- [ ] (옵션, 이전 배치 미결) 더 적극 보강안: Projects에 AX 프로젝트(Nova/Ground Control) 1건 추가 — 사용자는 이번엔 "Skills + Cases 1건"만 선택. 원하면 인쇄 3p 재점검 필요.
- [ ] (옵션) 로컬 폴더 `grant-works` → `keunsik-works` rename(세션 밖에서, live repo는 user Pages라 이름 고정). (이전 세션) LBDeveloper `2023.01 – 현재` 운영 여부 확인.

## Touch points
- `src/data/cv.ts` — PROFILE.nameEn(line ~6), SKILLS(맨 앞 2그룹 = AX), CASES(맨 앞 1건 = AX 게이트). 단일 SoT, /cv·/cv/print 모두 여기서 렌더.
- `src/pages/cv/print.astro` — scoped `@media print` 끝에 인쇄 압축 3줄. SKILLS는 `skillLine`(전 그룹 items join) 한 줄로 출력 → 그룹 추가 시 이 라인이 길어져 페이지 수에 영향.
- verify: `pnpm run build`(게이트 포함) → "build OK". preview `pnpm run preview`(:4321). 인쇄 페이지 수: `chrome --headless=new --no-pdf-header-footer --print-to-pdf=/tmp/x.pdf http://localhost:4321/cv/print/` → `pdfinfo /tmp/x.pdf | grep -i pages` → **Pages: 3**. 1440px 캡처: Chrome `--window-size=1440,9000 --screenshot` 후 ImageMagick `-crop 1440xH+0+Y`로 밴드 분할(reveal는 전체높이 캡처에서만 발화).

## Decisions
- CV 본문 AX 보강 범위 = 사용자 선택 "Skills 2그룹 + Cases 1건"(전체 재구성/Projects 추가는 보류). SKILLS는 AX-first 배치(타깃 = AX Product·Engineering Lead).
- AX 근거는 home 공개 Work 카드와 대응되는 것만 사용, 비공개 내부 서비스명 비노출(공개 이력서·disclosure 정책).
- 인쇄 3p는 절대 규칙처럼 유지 — 그룹/항목 추가 시 scoped @media print 간격 압축으로 흡수(콘텐츠 자르지 않음).
- 처리 방식 = 사용자 선택 "수정 → 로컬 확인 → 배포". Artifact 대신 localhost preview(사용자 이전 요청).
