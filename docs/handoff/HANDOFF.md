# Handoff — Grant Works 포트폴리오 + CV · 2026-06-05 · main (givepro91.github.io)

## Restore in 30s
**Grant Works** = 장근식(@givepro91)의 공개 포트폴리오 + 이력. Astro 정적 사이트, **라이브: https://givepro91.github.io** (repo `givepro91/givepro91.github.io`, USER 루트 페이지).
이번 세션에 ① 포트폴리오 본체(Home·Work·Lab·About) ② **CV**(`/cv` 상세 위키 + `/cv/print` 압축 이력서)를 만들고, **현재 기준으로 최신화**(스페이스워크 재직중·10년차·Landbook 운영종료) 후 **배포·라이브 검증 완료**. 별도로 **GitHub 프로필 README**(`givepro91/givepro91`)도 최신화 커밋함.
작업 트리 clean, 전부 push됨. 마지막 커밋 `7af914a`(인쇄 테두리 수정).

## Next steps
- [ ] **LBDeveloper 현재 운영 여부 확인** — 현재 `src/data/cv.ts`에서 `2023.01 – 현재`로 둠. Landbook 계열이라 같이 종료됐다면 과거형(예: `2023 – 2025`)으로. (Landbook은 이미 운영종료 반영됨)
- [ ] **프로필 사진** — `src/data/cv.ts`의 `PROFILE.photo`가 `null`. `public/cv/`에 이미지 넣고 경로 지정하면 /cv 카드에 표시(렌더 코드는 아직 photo 미사용 — 필요 시 cv/index.astro에 `<img>` 추가).
- [ ] (선택) CV 경력 서술·수치 정확성 사용자 검수 — 전부 `src/data/cv.ts` 한 파일.
- [ ] (선택) 커스텀 도메인(plan ADR-1 Follow-up), 영어 i18n(콘텐츠 `ko/` 구조만 준비됨).

## Touch points
- `src/data/cv.ts` — **CV 단일 소스**(위키 `/cv` + 이력서 `/cv/print` 공용). 이력 업데이트는 여기서. `PROFILE.current`(NOW 문구), `CAREER`, `PROJECTS`, `HIGHLIGHTS`(토스형 정량 임팩트).
- `src/pages/cv/index.astro` — 상세 위키(나무위키형 + Ledger), 사이드 TOC scroll-spy.
- `src/pages/cv/print.astro` — 압축 이력서. **scoped `<style>`에 `@media print` 오버라이드**(global보다 우선순위 높음 — 인쇄 테두리 제거가 여기 있음).
- `src/styles/global.css` — 디자인 토큰(**paper 기본**, ink 토글), `@media print` 규칙. **`break-inside:avoid`는 작은 항목(.r-job/.r-proj li)에만** — 큰 블록에 걸면 빈 페이지 생김.
- `src/pages/index.astro` / `src/layouts/BaseLayout.astro` — 홈(Hero 2단 콜로폰)·헤더(Work/Lab/About/CV, @givepro91 핸들)·테마/reveal 스크립트.
- `scripts/check-disclosure.mjs` — disclosure 게이트(**시크릿 패턴만** 차단, 회사명은 허용). `.githooks/pre-commit`에서도 실행.
- `.github/workflows/deploy.yml` — `main` push → build+게이트+deploy. **owner 가드(givepro91)**.
- verify: `pnpm run build`(게이트 포함). 인쇄 점검: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --print-to-pdf=/tmp/x.pdf http://localhost:4321/cv/print/`.

## Decisions
- 핵심 기획·라인업은 합의 플랜 `.omc/plans/grant-works-consensus-plan.md`(rev.8, **gitignore — 로컬만**). deep-interview spec `.omc/specs/deep-interview-grant-works.md`.
- **공개 정책(rev.7):** 회사명·프로젝트명 노출 OK, **진짜 시크릿·고객정보·비공개 수치만 차단**. 링크는 공개 repo/서비스만(zippit.im·nova-landing·markwand·cc-*). 시크릿 이력 repo(dh-project·plannext) 링크 금지.
- **Pages = GitHub Actions(build_type=workflow) + `public/.nojekyll`** — commit `6d7a208`. (기본 legacy Jekyll이 README를 서빙하던 문제 교정)
- **사실(추측 금지):** 스페이스워크 **재직 중**(2023.01~, 10년차, 근속 3년 5개월). 기존 PDF의 '퇴직·인재 추천서'(권고사직)는 **무시**. **Landbook 서비스 운영 종료**(과거화). MIRIVA·Nova는 **개인 프로젝트**.
- CV는 **토스형**(정량 임팩트 highlights 먼저 → 경력 → 프로젝트 → 강의). 기본 테마 ink→**paper**(사용자 요청).

## Gotchas / agreements
- `gh` active 계정이 자꾸 **jay-swk로 드리프트** → repo/ API 작업 전 `gh auth switch --user givepro91`. (단 `git push`는 SSH alias `github.com-givepro91` 사용이라 무관)
- **Astro scoped `<style>`가 global `@media print`를 이김**(specificity) → 인쇄 오버라이드는 scoped style 안에 둘 것.
- 브라우저 ⌘P의 날짜/URL/페이지번호는 인쇄 대화상자 "머리글 및 바닥글" 옵션(코드 무관).
- gitignore: `.omc/`·`design-prototype.html`·루트 `*.png`·`.playwright-mcp/`·`NOVA-STATE.md`.
- 프로필 README는 **별도 repo** `givepro91/givepro91`(commit `60bf9dc`) — 이 repo와 분리. gh API PUT(contents)로 갱신.
- Nova Quality Gate 커밋 훅 advisory는 이 repo에 무관(NOVA-STATE 의도적 제외).
