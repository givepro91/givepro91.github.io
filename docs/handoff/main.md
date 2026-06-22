---
branch: main
status: active
updated: 2026-06-22T13:56:58Z
---
# Handoff — Grant Works · 디자인 전면 개편 "Clean Wiki" · main (givepro91.github.io)

## Restore in 30s
**Grant Works** = 장근식(@givepro91) 공개 포트폴리오 + CV. Astro 정적, 라이브 https://givepro91.github.io.
이번 세션: 디자인 컨셉을 기존 **"The Ledger"(Fraunces 세리프·웜 페이퍼·번트시에나, 큼지막)** → **"Clean Wiki"(원티드형 클린 블루 #2563EB · Pretendard 통일 · 메타만 JetBrains Mono · 화이트/연그레이 카드 · 활자 압축 · 다크 제거)** 로 **전면 교체**. 위키 자산(사이드 TOC·인포박스·결정 로그·log.NNN·k·v 메타)은 카드/표로 재포장해 유지.
**상태: src 6개 + `public/cv/profile.jpg` 신규 = working tree (아직 미커밋·미배포).** `pnpm build` 통과 + 공개 게이트 PASS, 홈·Work상세·/cv·/cv/print 스크린샷 + PDF 3p 검증 완료. **프로필 사진 배치·아바타 렌더 검증 완료**(홈 76px·CV 60px rounded). 적용 결과 Artifact: https://claude.ai/code/artifact/d6efc80f-97e8-4e05-8eec-f591ed1d745d

## Next steps
- [x] ~~프로필 사진 배치~~ — `public/cv/profile.jpg` (400×400 정사각 크롭·~36KB, 원본 `~/Downloads/profile.jpeg`). 아바타에 실제 표시 확인됨.
- [ ] **커밋 + 배포** — 사용자 검토/승인 후. `main` push → `.github/workflows/deploy.yml` 자동 배포(outward-facing이라 승인 대기 중). **`public/cv/profile.jpg` 도 같은 커밋에 명시 staging**(git add 명시경로만).
- [ ] **사이드 스티키 TOC 유지 여부** — 사용자 문의("별로일까?"). 현재 유지(>1320px만 노출, /cv 8섹션에 유용). 사용자 답변 대기 — 제거 시 `.toc` 마크업(index.astro·cv/index.astro) + global.css `.toc` 블록 정리.
- [ ] (선택) 사용자 피드백 반영 — 색·밀도·문구 조정 여지.
- [ ] (이전 세션 미해결, 이번 작업 무관) LBDeveloper `2023.01 – 현재` 운영 여부 확인(`src/data/cv.ts`).

## Touch points
- `src/styles/global.css` — **전면 재작성**(디자인 시스템 단일 SoT). 새 시맨틱 토큰 + **옛 토큰명 alias 블록**(--paper/--paper-2/--muted/--ink-soft/--hair/--display 등 → cv/print scoped style 무손상). 라이트 단일, `@media print`는 토큰을 B&W+딥블루로 오버라이드.
- `src/pages/index.astro` — Hero=프로필 카드(.profile)+인포박스(.infobox), Now 카드, Work=`.work-list`, Lab `LAB_STATUS` 매핑(active→진행중/run, prototype→프로토타입/tool, experiment→실험/exp, paused→중단/pause, side→사이드). `heroLinks`는 CHANNELS에서 큐레이션(라벨충돌 방지). `PROFILE` import 추가.
- `src/components/ProjectCard.astro` — 단일 `.work-card`(THEMES import 제거됨).
- `src/layouts/BaseLayout.astro` — JetBrains Mono 링크(Fraunces/Gowun/Spline 제거), 다크 토글·FOUC 스크립트 제거, 헤더 `.brand`+nav+`.btn-cv`. reveal/scroll-spy 스크립트 유지.
- `src/pages/cv/index.astro` — cv-head에 작은 아바타(.cv-avatar), 카드화. `src/data/cv.ts` photo 경로.
- verify: `pnpm run build`(게이트 포함). 미리보기 `pnpm run preview`(:4321). 인쇄 PDF: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --print-to-pdf=/tmp/x.pdf http://localhost:4321/cv/print/` → **3 콘텐츠 페이지·빈페이지/테두리누출 없음**(검증됨).
- `design-prototype.html`(gitignore, 루트) — 새 컨셉 홈 단독 프로토타입(CDN 폰트). 디자인 SoT 참고용.

## Decisions
- **컨셉 전환**: 원티드/리멤버형 국내 채용플랫폼 톤 + 위키 느낌. 사용자 확정: **원티드형 클린 블루 #2563EB** · **Pretendard + 모노(메타/코드만)** · **전체 페이지 일괄 적용** · **라이트 단일(다크 제거)**.
- 아바타: 사진 우선, 없으면 이니셜 폴백. 사진은 "조그맣게"(사용자 요청) — 홈 76px / CV 60px rounded.
- cv/print는 마크업/scoped style 그대로 두고 **토큰 alias만으로 새 팔레트 상속** — 인쇄 회로 안정성 우선(이전 세션 인쇄 테두리 이슈 회귀 방지).
- 미커밋 유지 = 라이브가 outward-facing이라 사용자 승인 전 배포 보류(전역 규칙).
