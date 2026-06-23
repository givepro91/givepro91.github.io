---
branch: main
status: active
updated: 2026-06-23T01:46:46Z
---
# Handoff — Keunsik Works · 정체성 인식 최신화 + 줄바꿈 수정 · main (givepro91.github.io)

## Restore in 30s — 무엇을/어디까지/방금 끝낸 것
**Keunsik Works** = 장근식(@givepro91) 공개 포트폴리오 + CV. Astro 정적, 라이브 https://givepro91.github.io. 단일 SoT = `src/data/cv.ts` + `src/config.ts`.
- **직전 배치(CV의 AX 증거 보강 — SKILLS 2그룹/CASES 1건/nameEn 통일 + print 3p 복귀)는 `79e2752`로 커밋·배포 완료.** (그 이전: Clean Wiki 개편·리브랜드·AX 리포지셔닝·Lab/썸네일, ~aef2933 배포 완료.)
- **이번 세션 = ① 사용자 정체성 인식 최신화 ② CV Career 잔여 백엔드 톤 정리 ③ 한국어 줄바꿈 고아 수정. 3가지 모두 커밋(`cd493b9`, `7340d81`)·푸시·Actions 배포 success·라이브 마커 검증 완료.**
- **트리거**: 사용자 "프로젝트가 아직 나를 백엔드 엔지니어로 인식한다. 내 현재를 기록하는 레포 `jay-swk/social-portfolio-os`를 기반으로 생각하고 지침에 추가해라."
- **핵심 발견**: 사이트 콘텐츠는 *이미* AX 중심(title `AX Product · Engineering Lead`, 태그라인·Skills·Vision 전부 AX). "백엔드 인식"의 실체 = **레포에 프로젝트 지침이 없어 Claude가 코드·git 이력 보고 백엔드로 기본값 잡던 세션 멘탈 모델 문제** → 지침/메모리로 고정.
- **① 정체성(`AGENTS.md` 신규 + 메모리 2건)**: AGENTS.md에 "백엔드로 단정 금지 / 현재=Technical Product Lead·AX 리드 / 정체성 정본 `jay-swk/social-portfolio-os`의 strategy/ 먼저 확인 / 피할 표현(풀스택 됐다·AI로 다 한다·사람 대체)" 박음. 사용자 선택으로 **공개 레포에 커밋**. 메모리(`~/.claude/projects/<this>/memory/`): `jay-current-identity`, `ref-social-portfolio-os`, `MEMORY.md`.
- **② Career 톤(`src/data/cv.ts` 스페이스워크 항목)**: role `백엔드 리더 / 제품팀` → `Technical Product Lead / 백엔드·제품팀`; summary를 "백엔드 설계·운영·팀 리딩 **기반 위에** → LLM API·운영 자동화·데이터 신뢰성으로 제품/기술 접점 확장"으로(사실관계 유지). **헤드라인 title `AX Product · Engineering Lead`는 사용자 선택으로 그대로 유지**(SoT 명함 "Technical Product Lead | PropTech × AI"는 내부 참고로만).
- **③ 줄바꿈(`src/styles/global.css`)**: 히어로 태그라인 "…사람입니다." 외톨이 줄 → `.p-tagline text-wrap: balance`. body 기본 `text-wrap: pretty`(본문 고아 방지) + 짧은 표시 텍스트(`.sec-title/.sec-note/.p-sub/.wc-title/.wc-pos/.now-card p`)에 `balance` → Work 카드 "·운영했습니다." 등 줄머리 외톨이 해소. **인쇄 3p 유지 검증.**

## Next steps
- [ ] (사용자 보류) **공개 /cv 전화번호(`cv.ts:10` 010-3175-9809)** — SoT 정책상 비공개 권장이나 사용자가 2026-06-23 "일단 유지" 선택. 추후 제거 원하면 `cv.ts` phone 비우거나 렌더 조건 처리.
- [ ] (사용자 질문 중) **전역 지침 승격** — 현재 정체성/SoT 포인터는 *이 레포*(AGENTS.md)+*이 프로젝트 메모리*에만 있음 → 다른 레포(miriva·nova·swk-infra 등)엔 안 실림. 원하면 전역 `~/.claude/CLAUDE.md`에 한 줄 포인터 추가(권한 있음). 사용자 결정 대기.
- [ ] (옵션, 이전 배치 미결) 로컬 폴더 `grant-works` → `keunsik-works` rename(세션 밖, live repo는 user Pages라 이름 고정). package.json `name`도 아직 `grant-works`. LBDeveloper `2023.01 – 현재` 운영 여부 확인.

## Touch points
- `src/data/cv.ts` — 단일 SoT, /cv·/cv/print 모두 여기서 렌더. PROFILE.title(line 7, `AX Product · Engineering Lead`·유지), PROFILE.phone(line 10·공개 노출 중), CAREER[0] 스페이스워크 role/summary(line ~58/60, 이번 수정).
- `src/styles/global.css` — body(line ~60)에 `word-break:keep-all`+`overflow-wrap:break-word`+`text-wrap:pretty`. `.mono` 아래(line ~79)에 짧은 표시 텍스트 balance 그룹 규칙. `.p-tagline`(line ~199) `text-wrap:balance`. `.about-lead` 기존 balance. **줄바꿈 조정 = 이 규칙들 건드림.**
- `AGENTS.md`(루트) — 정체성·SoT 레포 지침. 직무/이력 작업 전 필독.
- 메모리 `~/.claude/projects/-Users-keunsik-develop-givepro91-keunsik-works/memory/` — MEMORY.md 인덱스 + jay-current-identity + ref-social-portfolio-os.
- 정체성 정본 읽기: `gh api 'repos/jay-swk/social-portfolio-os/contents/<path>' --jq .content | base64 -d` (핵심: strategy/profile-copy.md, strategy/github-derived-positioning.md, strategy/profile-analysis.md).
- verify: `pnpm run build`(게이트 포함). preview `pnpm run preview`(:4321). 인쇄 3p: `chrome --headless=new --no-pdf-header-footer --print-to-pdf=/tmp/x.pdf http://localhost:4321/cv/print/` → `pdfinfo … | grep -i pages` → **Pages:3**. 1440 캡처: `chrome --headless=new --force-device-scale-factor=2 --window-size=1440,H --screenshot` 후 `magick … -crop WxH+0+Y`로 밴드 분할. 라이브 마커: `curl -s https://givepro91.github.io/cv/ | grep 'Technical Product Lead'`.

## Decisions
- **정체성 정본 = `jay-swk/social-portfolio-os`**(private, givepro91 접근 가능). "백엔드를 토대로 → AX(AI Transformation) 리드로 확장"이 서사. 백엔드 폐기 아님. 피할 표현: 풀스택 됐다/AI로 다 한다/사람 대체.
- 공개 직책 표기 = **`AX Product · Engineering Lead` 유지**(사용자 선택). SoT 명함 표기와 다르지만 의도된 공개 브랜딩.
- 줄바꿈 정책 = 짧은 표시 텍스트(제목·태그라인·카드 설명) `text-wrap: balance`, 긴 본문 `text-wrap: pretty`. `word-break:keep-all`+`overflow-wrap:break-word` 유지.
- 인쇄 3p는 절대 규칙처럼 유지 — 텍스트/스타일 변경 시 pdfinfo로 항상 재검증.
- 캡처/스크린샷은 전부 scratchpad로(레포 오염 금지). 명시 경로만 staging(`git add -A` 금지).
