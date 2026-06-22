---
branch: main
status: active
updated: 2026-06-22T15:11:03Z
---
# Handoff — Keunsik Works · Clean Wiki + 리브랜드 · main (givepro91.github.io)

## Restore in 30s
**Grant Works** = 장근식(@givepro91) 공개 포트폴리오 + CV. Astro 정적, 라이브 https://givepro91.github.io.
- **이미 배포됨(커밋 9386116..23f00aa)**: 디자인 "The Ledger" → **"Clean Wiki"**(원티드형 클린 블루 #2563EB · Pretendard 통일 · 메타만 JetBrains Mono · 화이트/연그레이 카드 · 라이트 단일) 전면 개편 + 프로필 사진.
- **이번 배치 = working tree(미커밋·미배포), 빌드+게이트 PASS·로컬 검증 완료**: ① Lab 정리(15→8, 삭제 ccm-hub/pulsar/ccmanager/person-documentary/veo-create/swk-cloud-manage, cc-roadmap+cc-handoff→**cc-skills**, nova-orbit→experiment, yeongjong-life→**Insta Content Studio**) ② **Lab을 단일 `src/data/lab.ts`로 통합**(content 컬렉션 제거) ③ About/hero 채널 순서 GitHub→…→Brunch ④ TOC **헤더 오프셋(scroll-padding 72px)** + **WORK 하위 프로젝트 중첩**(서브 스크롤스파이) ⑤ **공개 제품 썸네일**(zippit→Work, plannext·qpicker·lbdeveloper→CV) `public/og/*`.
- `gh repo archive givepro91/ccmanager` **완료**(givepro91 계정으로). 사용자 지시 "레포 포함 제거" 중 실제 레포 있던 건 ccmanager뿐(ccm-hub·pulsar 레포 없음).
- **리브랜드(이 배치)**: "Grant Works" → **"Keunsik Works"**, "Geun-sik (Grant) Jang" → **"Keun-sik Jang"** (config·BaseLayout·global.css·cv.ts·cv/index·README 전부). give→grant 워드플레이 제거. **프로필 README `givepro91/givepro91`도 갱신 완료(별도 commit 4b043fd, gh API)**.
- **TOC 오버플로 수정**: 1440px에서 하위 라벨이 본문 침범 → 라벨 13자 word-boundary 축약(index.astro) + `.toc-sub a` width 124px 말줄임 + `.toc` left 18px + 노출 브레이크포인트 1320→**1439px(>=1440 노출)**. 1440px 캡처로 겹침 해소 확인.
- **줄넘김 수정**: body `overflow-wrap: anywhere → break-word`. keep-all과 함께 어절 단위로만 끊겨 "설계·운영" 중간점(·)이 줄머리에 떨어지던 문제 전역 해소.
- **AX 리포지셔닝(코덱스 평가 기반)**: 타깃 포지션 = **AX Product/Engineering Lead**(백엔드 엔지니어 X). title→"AX Product · Engineering Lead"(config SITE.title + cv.ts PROFILE.title, 홈/CV/CV-print 싱크). summary/current = AX 서사(문제정의→현업→AI·자동화 설계→운영 안전장치→성과→재사용 패턴화). HIGHLIGHTS = AX 4기둥(운영을 제품으로 / agent를 승인·취소·롤백·감사로 통제(human-in-the-loop) / workflow성공≠데이터성공 신뢰성 / 기록=플레이북) + 정량 엔지니어링. VISION AX화. 홈 인포박스 "백엔드·제품 → AX 리드". **개인 프로젝트(MIRIVA·Nova) vs 회사 구분 유지**(과대표현 금지). CAREER/PROJECTS는 사실 그대로(증거).
- **인쇄(/cv/print)**: AX summary가 길어 4p로 늘자 @page 13→11mm·`.r-block` 16→13px·print HIGHLIGHTS는 `slice(0,6)`로 **3p 복귀**(orphan 페이지 제거) — 검증됨.

## Next steps
- [ ] **이번 배치 커밋 + 배포** — 사용자 "배포" 한마디 대기(로컬 검토 중). 명시경로 staging: 변경 src(ProjectCard·config·content.config·cv.ts·cv/index·index·BaseLayout·global.css·zippit.md·README) + 삭제 `src/content/lab/**`(15개) + 신규 `src/data/lab.ts`·`public/og/`(4) + `docs/handoff/main.md`. push→Actions 자동 배포.
- [ ] **repo 이름 변경 요청 응답 대기** — live repo는 `givepro91/givepro91.github.io`(유저 Pages라 이름 고정·변경 불가), "grant" 이름 repo 없음. 로컬 폴더만 `grant-works` → 원하면 `keunsik-works`로 rename(원격 무관, 세션 cwd 깨지니 세션 밖에서). 사용자 확인 필요.
- [ ] (옵션, 사용자 결정 대기) 더 많은 제품 이미지 — markwand/nova는 GitHub 소셜카드라 0-stars 노출돼 제외함. 사용자 제공 실제 캡처 있으면 추가.
- [ ] (이전 세션 미해결) LBDeveloper `2023.01 – 현재` 운영 여부 확인(`src/data/cv.ts`).

## Touch points
- `src/data/lab.ts` — **Lab 단일 SoT**(8항목, order 정렬). 추가/수정/상태변경 여기서. content.config.ts에서 lab 컬렉션 제거됨, `src/content/lab/` 삭제됨.
- `src/pages/index.astro` — Hero 프로필카드+인포박스, `LAB` import(getCollection 아님), Lab `LAB_STATUS` 매핑, TOC `.toc-group`/`.toc-sub`(WORK 하위) + 서브 스크롤스파이 IIFE.
- `src/components/ProjectCard.astro` — `.work-card`, 이미지 있으면 `.has-thumb` grid + `.wc-thumb`. anchor `id="w-{slug}"`.
- `src/pages/cv/index.astro` — 프로젝트 `.cv-entry.has-thumb`(flex) + `.cv-thumb`(우측). cv-head 작은 아바타.
- `src/data/cv.ts` / `src/content.config.ts` — `image?` 필드 추가. cv PROJECTS 3건(plannext/qpicker/lbdeveloper) + zippit.md image 지정.
- `src/styles/global.css` — 디자인 시스템 SoT. `html{scroll-padding-top:72px}`(헤더 오프셋), `.toc-sub`, `.work-card.has-thumb`/`.cv-entry.has-thumb` 썸네일 grid/flex. 옛 토큰 alias 블록 유지(cv/print 무손상).
- `public/og/` — zippit.png·qpicker.png·plannext.jpg·lbdeveloper.jpg (og:image/홈캡처, 800px·합~335KB).
- verify: `pnpm run build`(게이트 포함) → 15p. `pnpm run preview`(:4321). 인쇄 PDF: `chrome --headless=new --no-pdf-header-footer --print-to-pdf=/tmp/x.pdf http://localhost:4321/cv/print/`.

## Decisions
- Lab "하드코딩이라 최신화 어렵다" → **단일 lab.ts**로 통합(사용자 선택). Lab은 본문 없어 무손실. (대안 'GitHub 자동수집'은 보류)
- 제품 이미지(사용자 옵션 요청): 공개링크 제품만. **zippit/qpicker/plannext** 양호, **lbdeveloper**는 로그아웃 공개 랜딩(지적도+안내, 고객데이터 없음)이라 채택. **markwand/nova GitHub카드는 0-stars 노출로 제외**. plannext/lbdeveloper는 og 없어 홈 화면 캡처.
- 사이드 스티키 TOC: 사용자 "유지" 확정. WORK에 하위 프로젝트 중첩 추가.
- ccmanager 레포는 **삭제 아닌 archive**(되돌릴 수 있음, 사용자 선택). gh 계정 givepro91로 전환 필요(jay-swk 드리프트 시 ArchiveRepository 권한오류).
- 미커밋 유지 = outward-facing, 사용자 로컬 검토 후 배포(전역 규칙). 보여주기는 **Artifact 대신 로컬 preview**(사용자 요청 — Artifact 느림).
