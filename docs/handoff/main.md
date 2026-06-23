---
branch: main
status: active
updated: 2026-06-23T05:47:08Z
---
# Handoff — Keunsik Works · 제품 이미지 갤러리 + 로컬 콘텐츠 관리 도구(3분할 admin) · main

## Restore in 30s — 무엇을/어디까지/방금 끝낸 것
**Keunsik Works** = 장근식(@givepro91) 공개 포트폴리오 + CV. Astro 정적 → 라이브 https://givepro91.github.io. 정체성=`AX Product · Engineering Lead`(백엔드로 단정 금지 — `AGENTS.md` 필독).
- **데이터 SoT**: 포폴 텍스트=`src/content/projects/ko/*.md` frontmatter(본문 전부 빈값) · 이력서 텍스트=`src/data/cv.json`(`cv.ts`는 타입 re-export) · 제품 이미지=`src/data/galleries.json`.
- **이번 세션 누적(전부 검증 완료, 아직 커밋 안 함 — main 푸시=라이브 배포라 사용자 승인 대기):**
  1~3. 제품 이미지: 썸네일+라이트박스 → 본인 제품 OG → 다중 갤러리 + 실제 랜딩 화면 직접 캡처.
  4~5. 로컬 admin(이미지 → 포폴/이력서 전체 텍스트까지).
  6. admin UX 전면 재설계. 피드백 "불편/DnD없음/초짜" → ① **3분할**(좌 목록·중 폼·우 실시간 미리보기) ② **드래그앤드롭** 순서변경(이미지+모든 배열, ⠿ 그립) ③ **실시간 미리보기 iframe**(실제 work-card/cv 마크업 + `/global.css` → 사이트 동일 즉시 렌더) ④ 핵심/고급 분리·필드 설명·토글.
  7. **방금 끝낸 것 = 미리보기 폭 조절.** 피드백 "미리보기 고정이라 작아서 실제 가늠 안 됨" → ① **리사이저**(폼/미리보기 경계 `#rz` 드래그 → CSS var `--pv`) ② **⤢ 넓게 토글**(`.shell.pv-max` = 미리보기 전체폭) ③ **🖥/📱 데스크탑·모바일**(`.preview.mobile` iframe 402px → 모바일 미디어쿼리 발동). URL `?pv=max`·`?pvw=mobile`로 초기상태 지정(캡처용).
- **admin = 로컬 전용 Node 서버**(`npm run admin` → 127.0.0.1:4400, Astro/라이브와 분리, dist 미포함). 현재 기동 중(bg). 코드 바꾸면 서버 재시작 필요(admin.html은 새로고침이면 반영).
- 사용자 진단(자기비판 채택): "이건 CMS가 아니라 DB 폼이었다 — 결과를 보며 못 고치고, 데이터 모델을 그대로 노출". → 미리보기·DnD·위계로 해결.

## Next steps
- [ ] **(사용자 결정 대기) 커밋·배포** — 명시 경로만 `git add`(`git add -A` 금지). 수정: `package.json` `pnpm-lock.yaml` `src/components/ProjectCard.astro` `src/pages/cv/index.astro` `src/pages/work/[slug].astro` `src/layouts/BaseLayout.astro` `src/styles/global.css` `src/content.config.ts` `src/data/cv.ts` `src/content/projects/ko/zippit.md`. 신규: `src/data/cv.json` `src/data/galleries.json` `scripts/admin-server.mjs` `scripts/admin.html` + 이미지 9개(`public/og/*` nova/landbook/landbook-landing/plannext-landing/qpicker-landing/qpicker-app/zippit-landing/zippit-features/markwand) + `docs/handoff/main.md`. 커밋 예 `feat: 제품 이미지 갤러리·라이트박스 + 로컬 콘텐츠 관리 도구(admin)`.
- [ ] **사용자 사용법** — `npm run admin` → http://127.0.0.1:4400. 좌측에서 프로젝트/섹션 선택 → 중앙에서 편집(이미지·배열 ⠿ 드래그 정렬, 핵심 위·고급 접기) → 우측 미리보기 즉시 확인 → [저장] → `git add public/og src/data src/content && commit && push`.
- [ ] **Markwand 실제 앱 스크린샷** — 데스크톱 앱이라 자동 캡처 불가, admin에서 직접 업로드.
- [ ] (옵션) disclosure allowlist에 `landbook.net`(비차단 REVIEW). (옵션) package.json `name`=`grant-works`.

## Touch points
- `src/data/galleries.json`(이미지 SoT, key=work slug/cv name) · `src/data/cv.json`(이력서 SoT, cv.ts는 타입 re-export). cv.json 재생성=Node26 type-strip(`node --input-type=module -e "import('./src/data/cv.ts')…"`).
- `scripts/admin-server.mjs` — 로컬 Node http(127.0.0.1:4400). **js-yaml은 `createRequire`로 로드**. 라우트: GET /api/content·/global.css·/og/*, POST /api/work({slug,frontmatter}→md R/W 본문보존)·/api/cv(cv.json)·/api/upload(base64→public/og)·/api/save(galleries)·/api/delete-file. `npm run admin`.
- `scripts/admin.html` — **3분할 SPA**. `enableDnD(container,arr,onDone)` = ⠿핸들 draggable+drop reorder(이미지/배열 공용). `field()` 범용 위젯(text/textarea/toggle/select/number/array/objarray/object). `workCardHtml`·`cvSectionHtml`·`cvEntryProj` = 실제 마크업 복제(미리보기). iframe `srcdoc`+`/global.css`, `#root` innerHTML 갱신. URL `?tab=work|cv&sel=<key>`. 핵심필드 CORE_WORK, 나머지 고급 `<details>`.
- `src/components/ProjectCard.astro`·`cv/index.astro`·`work/[slug].astro` — galleries.json에서 shots. **.astro template `{}` 안 TS 제네릭 `as Record<…>` 금지(JSX 오인)** → cv/index frontmatter `cvShots` 헬퍼, work/[slug] 스트립 `shots.slice(1)`.
- `src/layouts/BaseLayout.astro` 라이트박스(data-gallery JSON·‹›·←→·i/n) / `src/styles/global.css` `.shot/.shot-count/.detail-strip/.strip-thumb/.lb-nav`.
- 의존성 `js-yaml`(devDep, admin 전용·빌드무관), `pnpm-lock.yaml` 변경.
- **검증 → 기대**: `pnpm run build`→OK+disclosure PASS(landbook.net 비차단 REVIEW), 인쇄 `pdfinfo`→Pages:3. admin: `curl :4400/api/content`(work12+cv10섹션)·`/global.css` 200, UI 3분할+미리보기+DnD 그립 스크린샷 확인, work/cv POST round-trip 후 빌드 OK·복원, `ls -R dist|grep -i admin`→NONE. **캡처주의**: `--virtual-time-budget` 금지(행), macOS `timeout` 없음, `--force-prefers-reduced-motion`(reveal 가시화), 해시앵커 캡처 빈화면(top+큰window+magick crop). admin iframe 미리보기는 캡처 시 정상 렌더 확인됨.

## Decisions
- admin UX = 3분할 + 실시간 미리보기(iframe+실제 마크업 복제+global.css) + DnD. "결과를 보며, 사이트 모양 그대로" 편집. 데이터모델 노출 대신 핵심/고급 위계.
- 이력서 SoT=cv.json / 포폴=content collection 유지(zod 검증) + admin frontmatter R/W / 이미지=galleries.json.
- 관리도구=로컬 전용(Astro·라이브 분리, dist 미포함). 정적 사이트라 라이브 GUI는 Decap+OAuth 필요해 제외.
- 실제 화면=본인 제품 공식 사이트 직접 캡처만. anon 카드: 회사민감=텍스트만(admin 경고)/개인=공개화면 가능. Markwand 실화면은 사용자 업로드 대기.
- 커밋·배포는 사용자 승인 후. `git add -A` 금지·명시경로만. 캡처/백업 throwaway는 scratchpad만(레포 오염 0).
