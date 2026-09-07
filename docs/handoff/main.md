---
branch: main
status: done
updated: 2026-09-07T02:56:19Z
---
## 2026-09-07 — Windows 한글 뭉개짐 수정: `--mono` 스택에 한글 폴백 없음

### Restore in 30s — what you were doing / where you got to / what you just finished
근식 리포트: *"윈도우로 볼때 '이력서와 함께 보면 좋은 ~' 여기 폰트가 좀 뭉개진다"*.

**원인 확정**: `.rz-callout-lead`(`src/styles/resume.css:102`)가 한글 문장인데 `font-family: var(--mono)`. JetBrains Mono 에 **한글 글리프가 없고**(Google Fonts `unicode-range` 를 curl 로 실측 — Latin/Latin-ext/Cyrillic/Greek 뿐, U+AC00–D7A3 없음), 종전 `--mono` 스택엔 한글 폰트가 하나도 없었다.

```
"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace
  ↑한글 없음     ↑Win 미지원   ↑mac 전용     ↑mac 전용  ↑Win = Courier New
```
- macOS: Menlo 에서 시스템이 Apple SD Gothic Neo 로 이어받아 멀쩡 → **맥에서는 절대 안 보이는 버그**
- Windows: generic `monospace` = Courier New → 한글 없음 → 윈도우 폰트링크가 **굴림체**(비트맵 계열)를 물림 → 10.5px 에서 뭉개짐

`--sans` 에는 `"Apple SD Gothic Neo", "Segoe UI"` 같은 OS별 한글 대비책이 있는데 `--mono` 에만 빠져 있던 게 차이다.

**전수 조사**: mono 를 쓰는 클래스 104개를 추출해 그 클래스가 붙은 엘리먼트의 한글 포함 여부를 대조 → **8개 파일 45곳**이 같은 증상. (`cv/index` 15 · `portfolio/print` 9 · `roadmap` 8 · `work/[slug]` 6 · `cv/print` 3 · `index` 2 · `cv/resume` 2 · `ProjectCard` 1). `log.cv — 상세 이력`, `왜/무엇/증명` 라벨, `PDF로 저장 / 인쇄 ⌘P` 버튼, 로드맵 kicker 등.

**끝난 상태 — 수정·검증 완료, 커밋 안 함**(레포 규칙: 사용자 요청 시에만).

### 고친 것 (4파일)
1. **`src/styles/global.css`** — `--mono` 에 `Consolas`(Win 라틴 대비) + `"Pretendard Variable", Pretendard, "Apple SD Gothic Neo", "Malgun Gothic"` 추가. 폰트 대체는 **글자 단위**라 라틴·숫자는 그대로 JetBrains Mono, 한글만 Pretendard 로 간다. 한글 폰트를 mono 폴백들 **뒤**에 둔 이유: JBM 로드 실패 시엔 라틴이 여전히 Menlo/Consolas 로 가야 하기 때문.
2. **`src/pages/portfolio/print.astro`** — `.deck` 이 `--mono`/`--sans` 를 더 짧게 재정의하며(`"JetBrains Mono", ui-monospace, monospace`) 한글 대비책을 잃고 있었다 → 재정의 삭제, 전역 `:root` 토큰 사용. 하드코딩 `font-family: "JetBrains Mono", monospace` 2곳(`.print-actions`·`.pa-print`, 문구가 한글)도 `var(--mono)` 로.
3. **`src/layouts/BaseLayout.astro` · `src/pages/interview.astro`** — Google Fonts JetBrains Mono `wght@400;500;600` → **`;700` 추가**. `font-weight: 700/800` 을 mono 에 주는 규칙이 6곳이라 **가짜 볼드 합성**이 걸리고 있었다(Windows 굴림체 합성 볼드는 특히 번짐).

### 후속 — 콜아웃 리드 문장을 sans 로 (근식: *"적용하고 배포까지 해줄것"*)
mono 스택에서는 **공백까지 JetBrains Mono 폭**이라 한글 어절 사이가 벌어졌다. 리드 문장만 sans 로 전환:
- `src/styles/resume.css:102` · `src/pages/cv/print.astro:229` — `var(--mono)` → `var(--sans)`, `10.5px` → `11.5px`(모노는 같은 px에서 x-height가 커 보여 광학 크기 보정), `letter-spacing: 0.02em` → `0`.
- **URL(`.rz-callout-u`·`.r-callout-u`)은 mono 유지** — 라틴이라 원래 문제 없고 모노 악센트가 의도된 디자인.
- 확인: `.rz-callout-lead` 실제 `font-family` = Pretendard, `.rz-callout-u` = JetBrains Mono. 어절 벌어짐 해소(zoom 캡처).

### Next steps — concrete next actions / blockers / parked items
- ⚠️ **`src/data/cv.json` 은 이번 세션이 건드리지 않았다.** 세션 시작 시점부터 이미 `M` 이었다 — 내용은 **앞선그룹 재직기간 정정**(`2018.11 – 2019.12` / `1년 1개월` → `2018.11 – 2020.01` / `1년 3개월`). **이번 커밋에서 제외했다.** 사실 확인 후 별도 커밋할 것.
- ⚠️ **`src/data/cv.json` 은 이번 세션이 건드리지 않았다.** 세션 시작 시점부터 이미 `M` 상태였다 — 별건이므로 같이 커밋하지 말 것.
- ✅ **Windows 실기 확인 완료** (2026-09-07, 근식: *"확인했어 잘보여"*). 남아 있던 유일한 unverified 항목이었다 — macOS 에서는 원래 재현되지 않는 버그라 코드 쪽 검증만으로는 닫을 수 없었고, 원인 추론(Courier New → 폰트링크 굴림체)이 실기에서 확인됐다.

### Touch points — path:line, verification command → expected result
- `src/styles/global.css:31-37` — `--mono` 토큰(주석 포함)
- `src/pages/portfolio/print.astro:284` — `.deck` 의 토큰 재정의 삭제 자리 / `:287,289` — `var(--mono)` 로 교체
- `src/layouts/BaseLayout.astro:58` · `src/pages/interview.astro:23` — `wght@400;500;600;700`
- `src/styles/resume.css:102` · `src/pages/cv/print.astro:229` — 문제의 `.rz-callout-lead`/`.r-callout-lead` (mono 유지 중, 위 "판단 대기" 항목)
- `pnpm build` → `check-disclosure`(source·dist) **PASS**, 20페이지 빌드 성공 (실측)
- `pnpm preview --port 4331` 후 `/cv/resume`·`/cv/print` 에서 브라우저 콘솔:
  ```js
  // 세로 위치에 둔감한 글리프 지문(컬럼별 alpha 합) + advance width 로 실제 렌더 폰트 판별
  // 수정 전 스택 → 47ade7eb w=276.80 (= Menlo/시스템 폴백)
  // 수정 후 --mono → b1066240 w=276.56 (= Pretendard, --sans 와 동일)
  ```
  전문은 아래 Verify 표. 스크립트는 스크래치패드에만 두고 레포엔 안 남겼다.

### Verify (전부 실측)
`'이력서와함께보면'`(공백 제외 — 공백은 JBM 폭이라 섞이면 판별을 흐린다) 40px 렌더 지문:

| 스택 | 지문 / advance | 판정 |
|---|---|---|
| 수정 전 `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace` | `47ade7eb` w=276.80 | 시스템 폴백 (= `Menlo` · `monospace` 기준과 동일) |
| **수정 후 `--mono`** | `b1066240` w=276.56 | **Pretendard** ✅ |
| `"Pretendard Variable"` 기준 | `b1066240` w=276.56 | — |
| `--sans` 기준 | `b1066240` w=276.56 | — |
| 라틴 `log.cv 2026` 수정 후 `--mono` | `164f455d` w=264.00 | **= JetBrains Mono 단독과 동일 → 모노 느낌 유지** ✅ |

- `/cv/print` 에서도 동일(`ed052a40` w=276.56 = Pretendard), 그리고 `document.fonts.check('700 11.5px "JetBrains Mono"')` → **true**, 700 페이스 `loaded` (수정 전에는 페이스 자체가 없었음).
- 시각 확인: `/cv/resume` 콜아웃 zoom 캡처 — 라틴 URL 은 JetBrains Mono 유지, 한글은 Pretendard.
- **인쇄 페이지 수 회귀 0** — headless Chrome print-to-PDF 로 변경 후/HEAD 기준 각각 측정: `/cv/resume` **6p → 6p**, `/cv/print` **5p → 5p**.
  - ⚠️ **핸드오프 2026-08-25 절의 "`/cv/resume` A4 5p" 는 낡았다** — HEAD(`8060a71`)를 임시 worktree 에 빌드해 재보니 **이미 6p** 다. 이번 변경 탓이 아니다. (같은 종류의 드리프트가 그 절의 "cv/print 4p" 에서도 한 번 있었다.)

### 함정 기록 — 폰트 판별에 픽셀 해시를 쓸 때
처음엔 캔버스 alpha 채널 FNV 해시로 비교했는데 `Menlo, "Pretendard Variable"` 이 Pretendard 단독과 **같은 폭인데 다른 해시**로 나와 "폴백 실패"로 오독했다. 원인: **글리프는 Pretendard 인데 baseline/세로 메트릭은 앞선 primary 폰트(Menlo)를 따라가서 1px 세로 시프트가 생긴다.** → 세로에 둔감한 지문(컬럼별 alpha 합)으로 바꾸니 즉시 일치. 그리고 문자열에 **공백을 넣으면 안 된다** — 공백은 JBM 이 커버하므로 폭 비교가 오염된다(초기 측정 131.375 vs 116.711 이 전부 이 탓).

### Decisions — one line each
- 개별 45곳을 고치지 않고 **`--mono` 토큰 한 곳**에서 고쳤다 — 원인이 토큰이고, 글자 단위 폰트 대체라 라틴 모노 느낌은 그대로 유지되기 때문.
- 한글 폴백을 mono 폴백들 **뒤에** 배치 — JBM 미로드 시 라틴이 Pretendard(비례폭)로 무너지지 않게.
- `Consolas` 를 추가 — Windows 에는 스택에 mono 가 하나도 없어 JBM 실패 시 라틴까지 Courier New 로 떨어지던 문제를 같이 해소.
- `.deck` 의 토큰 재정의는 되살리지 않고 삭제 — 전역 토큰과의 드리프트가 이 버그의 재발원이라서.
- `.rz-callout-lead` 의 mono 유지 여부는 디자인 판단이라 임의로 바꾸지 않고 근식에게 물었고, *"적용하고 배포까지 해줄것"* 회신을 받아 sans 로 전환했다.


## 2026-08-28 — English CV `/cv/en/` 추가

### Restore in 30s
영문 CV가 필요한 상황에 맞춰 한국어 CV의 공개 사실을 기준으로 별도 영문 표현 레이어와 페이지를 추가했다. 헤드라인은 **“Engineer building AI products from a backend foundation”**으로 번역했고, 스페이스워크 경력은 `Jan 2023 – Aug 2026` 과거형으로 유지했다. 영문 지원용으로 생년월일·전화번호는 새 페이지에 옮기지 않고 이메일·지역·공개 링크만 노출한다.

### 반영 내용
- `src/data/cv.en.ts` — 최신 `cv.json` 사실을 기준으로 Profile, Experience, Personal Products, Selected Projects, Skills, Education을 영문으로 정리. 탑과 용병단·놀곳은 `Personal Products`, 회사·개인 작업은 `Selected Projects`로 분리했다.
- `src/pages/cv/en/index.astro` — `/cv/en/` 영문 CV 페이지, Print / Save PDF 버튼, 반응형 화면과 인쇄 스타일 추가. 탑과 용병단 App Store·별도 케이스 스터디 링크 포함.
- `src/layouts/BaseLayout.astro` — 페이지별 `lang`, OG locale, CV 진입점, 푸터 문구와 영문 JSON-LD 지원.
- `src/pages/cv/index.astro`, `src/pages/cv/print.astro`, `src/pages/cv/resume.astro` — 기존 CV 화면에서 영문 CV 진입 링크 추가.

### Verify
- `pnpm build` → 공개 경계 source/dist PASS, Astro **23페이지** 생성, `/cv/en/index.html` 포함.
- `pnpm check:resume` → 기존 한국어 새 레이아웃 회귀 PASS.
- 영문 페이지 출력 확인 → A4 **4쪽**, 데스크톱 화면 및 영문 `lang="en"`·`og:locale="en_US"` 확인.
- PR #4 병합 커밋 `a1d0e05`, Actions `33159652954` build/deploy 성공.
- 라이브 `https://givepro91.github.io/cv/en/` HTTP 200 및 제목·canonical·영문 핵심 섹션 확인.
- `git diff --check` PASS.

### Next steps
1. ~~영문 CV 변경을 명시 경로만 커밋하고 PR 생성~~ → 커밋 `60f4ec8`, PR #4 병합.
2. ~~PR 병합 후 GitHub Pages 배포와 `/cv/en/` 라이브 검증~~ → Actions `33159652954` 성공, 라이브 확인 완료.

## 2026-08-28 — 탑과 용병단 별도 포트폴리오 + 커밋 수 지표 정리

### Restore in 30s
근식 요청: **my-wiki 최신을 기준으로 탑과 용병단 관련 이력과 포트폴리오를 추가**하고, 이력서·포트폴리오의 커밋 수 표기는 제거했다. 최신 `my-wiki/main` 커밋 `ec48b78`(2026-08-28)은 2026-08-18 출시 후 08-26 유료 게임 5위, 08-28 **롤플레잉 1위·유료 전체 3위**로 이어진 순위를 확인했고, 같은 시점의 실제 규모(하루 다운로드 115회·평가 2개·광고비 0)를 함께 기록했다.

기존 08-24 판단인 “게임은 커리어 축과 분리”는 유지하되, **성과가 발생한 개인 제품 이력으로는 공개**하기로 이번 요청으로 재검토했다. 정체성 헤드라인에는 넣지 않았고, 고용 경력(`CAREER`)에도 섞지 않았다.

### 반영 내용
- `src/data/cv.json` — `SOLO_PROJECTS`에 탑과 용병단 추가(2026.06–2026.08, 단독·유료 출시·전체 3위)하고 출시·순위·실제 규모·결정론적 전투·무료 데모·AI 협업 검증 기록을 유지. `HIGHLIGHTS` 마지막 항목은 놀곳과 게임 두 제품의 App Store 출시 및 게임 성과를 함께 요약. `PROFILE.current`의 “개인 앱”은 “개인 제품”으로 완화.
- `src/content/projects/ko/tower-mercenaries.md` — public Work 카드. 문제·역할·판단·결과·배움과 결정 로그를 평문으로 작성하고 App Store 링크 연결. 커밋 수는 지표에서 제거.
- `src/pages/portfolio/tower-mercenaries.astro` — App Store 스크린샷 5장과 출시·성과·판단 로그를 담은 별도 포트폴리오 페이지. 홈 Work 카드·CV·Work 상세·인쇄형 포트폴리오에서 진입할 수 있게 연결.
- `src/data/galleries.json`·`public/og/tower-mercenaries-*.jpg` — 공개 App Store 화면을 Work/CV 갤러리로 연결하고 이미지 확대를 지원.
- 기존 Work 카드의 커밋 수 지표를 운영 결과·역할·제품 형태 등으로 교체. 인쇄형 포트폴리오 `Other Works` 표에서는 타워를 제외하고 별도 케이스 링크로 노출.
- `src/data/lab.ts` — 출시 성과를 Lab 한 줄에도 반영.
- Work 정렬 — 새 카드가 놀곳 다음 `log.004`가 되도록 기존 order 4–12를 5–13으로 이동.
- `src/pages/cv/index.astro` — 개인 제품이 두 개가 된 상태와 실제 고용 경력 범위(`2016–2026`) 반영. 탑과 용병단의 App Store 링크·이미지·별도 포트폴리오 링크 추가. CV/포트폴리오의 낡은 “프로젝트 10개·결정 로그 10선” 문구 제거.
- `src/pages/cv/print.astro`, `src/pages/cv/resume.astro` — 새 `SOLO_PROJECTS`와 커밋 수 제거된 metrics가 자동 렌더되도록 확인. `/cv/resume`는 개인 제품 추가로 5쪽이 넘쳐 회사 제품 1건과 학습 섹션의 시트 배치를 조정.
- 정체성 문구(`PROFILE.title`, `src/config.ts`)는 변경하지 않음. “게임은 정체성 축과 분리” 원칙 유지.

### Verify
- `pnpm build` → 공개 경계 source/dist PASS, Astro **22페이지** 생성, `/work/tower-mercenaries/`와 `/portfolio/tower-mercenaries/` 포함.
- `pnpm check:resume` → A4 6쪽 모두 통과(최소 여유 35px), 화면·인쇄 위치/크기/폰트/색 **162개 요소 일치**.
- 생성 HTML 확인 → 홈 Work·Lab, `/cv`, `/cv/print`, `/cv/resume`, `/portfolio/print`, 신규 Work 상세·별도 포트폴리오, sitemap에 탑과 용병단 및 순위 노출.
- 데스크톱·모바일 레이아웃, 이미지 확대, 콘솔 오류 0건 확인. 라이브 URL 4곳 HTTP 200 확인.
- Work order 중복 없음, `git diff --check` 통과. PR #2 병합 커밋 `04f2398`, Actions `33154059883` build/deploy 성공.

### Next steps
1. ~~근식 확인 대기~~ → 이번 요청으로 별도 포트폴리오 페이지·이미지·링크·Other Works 분리까지 반영.
2. ~~커밋·푸시·배포 대기~~ → PR #2 병합 및 GitHub Pages 배포 완료.

---

## 2026-08-25 — 이력서 새 레이아웃 `/cv/resume` 추가 (기존 `/cv/print` 유지)

### Restore in 30s — what you were doing / where you got to / what you just finished
근식이 레퍼런스 이력서 이미지 3장을 주며 **"기존 내용은 살리되 디자인만 바꾼 다른 버전"**을 요청했다.
`/cv/print` 는 그대로 두고 **`/cv/resume` 를 신규 추가**했다. 데이터(`cv.json`)는 한 글자도 안 건드렸다.

**끝난 상태 — 구현·검증 완료, 커밋 안 함**(레포 규칙: 사용자 요청 시에만).

근식이 고른 3가지 (AskUserQuestion):
| 질문 | 선택 |
|---|---|
| 경로 | **`/cv/resume` 신규 추가** — `/cv/print` 병행 유지, 비교 후 정본 결정 |
| 스킬 표현 | **알약(pill) 뱃지 채택** — 가독성 우선. ATS용 평문은 `/cv/print` 가 계속 커버 |
| 사진·PII | **프로필 사진 + 생년월일까지 레퍼런스대로** (`/cv` 인포박스가 이미 공개 중이라 신규 노출 범주 아님) |

### 레이아웃
왼쪽 라벨 레일(118px, 인쇄 96px) + 오른쪽 콘텐츠 2단 그리드. 섹션마다 상단 구분선.
헤더(이름·정체성 한 줄·부제·이메일 + 원형 사진) → 연락처 레일/소개 → 핵심 역량 → 스킬(pill) → 경력 → 프로젝트 → 학습·활동 → 학력 → 일하는 방식.

- **기존 항목 전부 살림.** `/cv/print` 의 "함께 보면 좋은 자료" 콜아웃도 소개 블록 안에 유지.
- **레퍼런스에서 뺀 것**: 외국어(데이터 없음), 회사 로고 원형 아이콘(자산 없음 — 이니셜 대체는 조잡해서 미채택).
- **"N년차" 안 씀**: 계산 근거가 갈려서(재직 합산 8년 8개월 vs 첫 입사~현재 10년 6개월) `CAREER` 에서 그대로 세지는 `2016 – 2026 · 6개사` 만 표기.
- 소개 첫 문단이 헤더의 정체성 한 줄과 같은 말이면 자동으로 뺀다(문구가 바뀌면 다시 살아남).
- 학력에 `EDUCATION[].notes` 를 새로 노출 — `/cv/print` 는 생략하던 항목.

### 건드린 파일
- **신규** `src/data/skillGroups.ts` — `print.astro` 상단에 하드코딩돼 있던 `SKILL_GROUPS` 를 `items: string[]` 로 추출. `/cv/resume` 는 pill, `/cv/print` 는 `join(" · ")`.
- **신규** `src/pages/cv/resume.astro`
- **수정** `src/pages/cv/print.astro` — 위 정의 삭제 + import, 렌더부 `{g.items}` → `{g.items.join(" · ")}`. **그 외 변경 없음.**
- **수정** `src/pages/cv/index.astro` — PDF 버튼 옆 `이력서 PDF · 새 레이아웃 ↓` 링크 2곳.

### Verify (전부 실측)
- `check-disclosure`(source·dist) **PASS**, `astro build` 20페이지 성공.
- **`/cv/print` 회귀 0**: HEAD(`00bf7f0`)를 임시 worktree 에 빌드해 비교 → `dist/cv/print/index.html` **바이트 동일**, PDF 도 양쪽 5p.
  - ⚠️ **핸드오프의 종전 기록 "cv/print 4p" 는 낡았다** — HEAD 시점에 이미 5p 다. 이번 변경 탓 아님.
- `/cv/resume` A4 **5p**. 처음엔 6p(마지막 장 20%만 참)였는데, `.rz-job` 전체에 걸린 `break-inside: avoid` 가 400px+ 덩어리를 통째로 다음 장으로 밀고 있었다. 블록은 흐르게 두고 머리(`.rz-top`·`.rz-byline`·`.rz-summary`)에만 `break-after: avoid` 를 걸어 5p 로 수렴.
- **가로 넘침 0**: CDP `Emulation.setDeviceMetricsOverride` 로 320/390/480/640/768/1024/1280 전부 `scrollWidth == clientWidth`.
  - ⚠️ **함정**: headless `--window-size=390` 은 실제로 485px 레이아웃을 잡고 390px 만 캡처한다 — 잘린 스크린샷이 나와도 페이지 문제가 아니다. 모바일 검증은 반드시 CDP 에뮬레이션으로 할 것.
- 시각 확인: A4 5p 전부 + 데스크톱 1280 + 모바일 390 스크린샷(스크래치패드, 레포 밖).

### 부수 이슈 — `pnpm` 이 아예 없었다 → 복구 (같은 세션)
근식 셸에서 `pnpm dev` 가 `zsh: correct 'pnpm' to 'npm'` 로 떨어졌다. **Homebrew node 26 에는 corepack 이 없다**(Node 25부터 기본 배포 제외) — 그래서 pnpm 이 딸려오지 않았다. `brew install pnpm`(11.23.0) 설치 후엔 다음 에러:

```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild@0.25.12, esbuild@0.27.7, sharp@0.34.5
```

pnpm 10+ 가 postinstall 을 기본 차단하는데, **pnpm 11 은 `pnpm dev` 앞에서 자동으로 `install` 을 돌리며 그 차단을 경고가 아니라 에러로 올린다**. pnpm 이 `pnpm-workspace.yaml` 스텁(`allowBuilds: esbuild: set this to true or false`)을 만들어 두고 채우라고 요구한다.

- 해결: `pnpm approve-builds --all` → `pnpm-workspace.yaml` 에 `allowBuilds: {esbuild: true, sharp: true}`. 둘 다 astro/vite 가 실제로 쓰는 정상 패키지다.
- **`pnpm-workspace.yaml` 은 신규 추적 파일**이다(모노레포 아님에도 pnpm 11 이 이 위치를 쓴다).
- ⚠️ **CI 는 `pnpm/action-setup@v4 version: 10`** 이라 "pnpm 11 전용 키가 배포를 깨뜨리나"가 실제 위험이었다. → **격리 시뮬로 검증 완료**: `git archive HEAD` 한 트리에 변경 파일만 얹고 `pnpm@10 install --frozen-lockfile` → **exit 0, 빌드 스크립트도 정상 실행**(pnpm 10.34.5 도 `allowBuilds` 를 인식한다). 이어서 `pnpm@10 run build` → 게이트 PASS, `dist/cv/{resume,print}/index.html` 이 로컬 빌드와 **바이트 동일**.
- 참고: `npm run dev` / `npm run build` 도 그대로 동작한다(스크립트가 `astro` 를 직접 호출, `packageManager` 필드 없음).

### 후속 — PDF 페이지 경계 정리 + 섹션 순서 변경 (같은 세션)
근식 피드백: *"PDF로 뽑을때 역시 하나씩 자른다던지 하는게 중요할듯"* — 스킬 묶음이 두 장에 걸치고, 경력(피플리)이 "회사명 + 불릿 1개"만 남기고 잘리고 있었다.

**한 항목 = 한 페이지 원칙으로 되돌리고**(`.rz-job` · `.rz-minis` · `.rz-skills` · `.rz-lectures` 를 `break-inside: avoid`), 그 대가로 늘어나는 페이지를 **인쇄 밀도로 흡수**했다(본문 12px→11.5px, 칩 10.5px, rail 96→88px, padding 11/14mm→10/13mm, 각종 간격 축소).

**세 안을 실제로 렌더해 하단 빈 공간을 계량 비교**(A4 PNG 래스터라이즈 후 흰 픽셀 행 측정):

| 안 | p1 | p2 | p3 | p4 | 본문장 낭비 합 | 스킬 갈림 |
|---|---|---|---|---|---|---|
| A 스킬 통째 · 기존 순서 | **30.2%** | 12.7% | 6.3% | 4.2% | 53% | 없음 |
| B 스킬 묶음별 · 기존 순서 | 4.2% | 3.1% | 22.8% | 13.2% | 43% | **있음** |
| **C 스킬 통째 · 스킬을 위로** | **2.1%** | 9.1% | 19.4% | 13.2% | **44%** | **없음** |

→ **C 채택.** 전부 5페이지지만 C만 "안 갈림 + p1 꽉 참"을 동시에 만족한다.

- ⚠️ **섹션 순서를 바꿨다**: `스킬` 을 `핵심 역량` 위로 올렸다(레퍼런스 순서와도 일치). 이게 C 를 가능하게 한 핵심이다 — 되돌리면 A 가 되어 p1 에 30% 구멍이 난다. **근식 판단 대기 항목.**
- `핵심 역량` 은 여전히 p1→p2 로 흐른다. 불릿 리스트라 항목 단위로만 갈리므로 허용했다.

**함정 하나 기록** — `.rz-label` 에 `break-inside: avoid` 를 걸었더니 **6페이지 + p2 가 73% 빈** 결과가 나왔다. **그리드 행의 아이템 하나라도 `break-inside: avoid` 면 Chrome 이 행 전체를 통짜로 잡는다.** 라벨은 2~4글자라 어차피 안 갈리니 규칙에서 빼야 한다(CSS 주석에 남겨둠).

**Verify**: `pnpm build` 게이트 PASS, A4 **5p** 전 페이지 육안 확인(잘린 블록 0), 반응형 넘침 320/390/768/1280 전부 0.

### 재설계 — 화면=PDF 시트 방식으로 전환 (같은 세션, 3차)
근식 피드백 4건: ①핵심역량을 위로 ②웹과 PDF 폰트·크기가 다름 ③스킬이 쓸데없이 많음 ④**"애초에 웹에서 PDF와 같이 출력되는 걸 기준으로, 이어 붙이지 말고 페이지처럼 만들면 오차 작업이 줄어들 것"** ⑤밀도를 억지로 맞추지 말 것(여백이 오히려 읽기 좋음).

→ **구조를 갈아엎었다.** 연속 흐름 + 인쇄 오버라이드 방식을 버리고 **A4 시트 방식**으로:

- **화면에도 210×297mm 종이를 그린다.** `@media print` 는 종이 밖의 것(그림자·배경·액션바)만 걷어내고 시트마다 페이지를 끊는다. **인쇄 전용 폰트·간격 오버라이드가 하나도 없다** → 웹과 PDF가 원리적으로 같다.
- **페이지 나눔을 직접 배치.** 브라우저 break 추론 대신 `<Sheet>` 로 어느 항목이 몇 쪽에 갈지 정한다. `break-inside: avoid` 튜닝이 통째로 사라졌다.
- 밀도는 중간값으로(본문 12px). 시트 점유율 89/97/78/83/82/82% — 아래 여백은 남겨 뒀다.

**새 파일**: `src/styles/resume.css`(전체 스타일, 단일 소스) · `src/components/resume/{Sheet,Row,Entry}.astro` · `scripts/check-resume-pages.mjs`(+ `pnpm check:resume`).

**스킬 정리**: `SKILL_CHIPS` 신설 — 56개 → **32개, 3그룹**. 문장형 역량("대시보드에서 불러오는 중 / 대체 표시 / 실패 구분" 등)과 협업 도구(Git·GitHub·Notion·Jira·Slack)를 뺐다. **기존 `SKILL_GROUPS` 의 부분집합이라 새 주장 0** (스크립트로 검증). `/cv/print` 는 `SKILL_GROUPS` 를 그대로 써서 **영향 없음**.

**핵심 역량을 다시 맨 위로** — 2차에서 페이지 채우려고 스킬 아래로 내렸던 것을 되돌렸다. 시트 방식이라 더는 순서로 여백을 조정할 필요가 없다.

**함정 두 개 (둘 다 실측으로 잡음)**
1. ⚠️ **`@media (max-width: 900px)` 가 인쇄에도 걸린다** — 인쇄 뷰포트는 A4 폭(794px)이다. PDF 에서 레일이 무너지고 사진이 이름 위로 올라갔다. → **`@media screen and (max-width: 900px)`** 로 한정.
2. ⚠️ **시트 높이는 A4 폭 뷰포트에서 재야 한다.** 1400px 로 재면 위 분기를 못 만나 실제 인쇄와 다른 값이 나온다. `check-resume-pages.mjs` 는 794px + `Emulation.setEmulatedMedia: print` 로 잰다.

**Verify**
- `pnpm check:resume` → 시트 6장 전부 A4 안에 들어감(최소 여유 37px). PDF 페이지 수 **6 = 시트 수 6** 일치.
- **웹=PDF 검증**: 화면(1300px)과 인쇄(794px) 두 렌더에서 시트 기준 상대좌표·크기·font-size·line-height 를 요소 **122개** 비교 → **전부 동일**.
- `pnpm build` 게이트 PASS · 가로 넘침 320/390/640/768/900/1024/1280 전부 0 · 모바일은 종이를 접고 흐르는 문서로 폴백.

⚠️ **시트 배치는 수동이다.** `cv.json` 을 고치거나 항목을 옮기면 반드시 `pnpm check:resume` 를 돌릴 것. CI 러너엔 Chrome 이 없어 `pnpm build` 게이트에는 넣지 않았다.

### 색 어긋남 수정 — 전역 인쇄 토큰이 새고 있었다 (같은 세션, 4차)
근식: *"PDF로 볼때 색깔이 조금 다른느낌인데 내 착각이니?"* → **착각 아니었다.**

`src/styles/global.css` 의 **사이트 전역 `@media print`** 블록이 `:root` 토큰을 인쇄용으로 갈아끼운다(`--accent: #2563eb → #1a3f9c` 등). `/cv/print` 를 위해 예전에 넣은 결정이다. `resume.css` 는 `--ink` 계열은 `.rz-page` 에 자체 정의했지만 **`--accent` 는 `:root` 것을 물려받고 있어서**, 인쇄할 때만 파랑이 어두워졌다 — 액센트를 쓰는 `.rz-axis`·`.rz-meta-link`·`.rz-callout-lead/u`·`.rz-quote` 8곳.

- **확인 방법**: PDF 콘텐츠 스트림에서 `rg`(DeviceRGB 채움) 연산자를 뽑아 실제 색 목록을 비교했다. 13색 중 12색은 CSS와 정확히 같고 `#2563eb` 만 없고 `#1a3f9c` 가 있었다. (안티앨리어싱·색 프로파일 문제가 아니라 진짜 다른 값)
- **수정**: `.rz-page` 에 `--accent: #2563eb` 를 다시 못박았다. `:root` 보다 가까워서 인쇄에서도 이긴다. **`global.css` 와 `/cv/print` 는 손대지 않았다** — 그쪽 인쇄 파랑 결정은 그대로 유지.
- ⚠️ **3차의 "웹=PDF 122개 요소 일치" 검증은 좌표·크기·폰트만 봤기 때문에 이걸 못 잡았다.** 색을 안 봤다.

**`pnpm check:resume` 를 확장**: 이제 (1) 시트 넘침 + (2) **화면 vs 인쇄 렌더의 위치·크기·폰트·색** 155개 요소 대조. 실패 시 원인(전역 print 토큰 누수)까지 안내한다. **고침을 일시 되돌려 검사기가 실제로 8건을 잡는지 확인했다** — 안 짖는 개가 아님을 검증.

**최종 PDF 색 12종 전부 CSS 와 일치**(종이 #ffffff · 잉크 #16181c/#3d4249/#7b818b · 액센트 #2563eb · 칩 #f2f3f5/#e2e5e9 · 콜아웃 #f6f8fc/#dde5f3 · 구분선 #d3d7dd/#e7e9ed). ⌘P 의 "배경 그래픽" 체크박스를 꺼도 동일함을 확인(`print-color-adjust: exact` 가 이김).

### 배포 완료 (2026-08-25)
커밋 `dfee2f6` — 12파일 +978/−12, 명시 경로만 스테이징(`git add .` 미사용), pre-commit 게이트 PASS.
`origin/main` 푸시 → GitHub Actions **build·deploy 모두 success**.

**라이브 검증**(givepro91.github.io):
- `/cv/resume/` `/cv/print/` `/cv/` `/` 전부 200 · 사이트맵에 `/cv/resume/` 등재 · `/cv` 에 새 링크 2곳
- 라이브 HTML 에 `rz-sheet` **6개** · 스킬 칩 정확히 32개(뺀 항목 미노출 확인. "Google Workspace" 1건은 칩이 아니라 경력 본문 `Tailscale SSH·Google Workspace` — 정상)
- **라이브 페이지를 직접 PDF 로 출력**: **6쪽**, 색 12종 전부 CSS 와 일치, `#2563eb` 있고 `#1a3f9c` 없음
- 공개 경계 스캔(`spacewalk.tech|spacewalk.dev|gc.spacewalk|재직 중`) 3개 페이지 **0건**
- CI 는 pnpm 10 인데 `pnpm-workspace.yaml` 의 `allowBuilds` 를 정상 인식(사전 시뮬 결과와 일치)

### Next steps
1. **근식 확인 대기**: 6쪽 분량이 괜찮은지(밀도를 더 조이면 5쪽 가능), 스킬에서 뺀 항목 중 되살릴 게 있는지, `/cv/print` 와 `/cv/resume` 중 정본. — `pnpm dev` 후 <http://localhost:4321/cv/resume/>.
2. ~~커밋·푸시~~ → `dfee2f6`, 배포까지 완료(위 참조).
3. 파킹: `/cv/resume` 가 정본이 되면 `/cv/print` 정리 + `/cv` 버튼 라벨 정돈이 남는다.

---

## 2026-08-24 — SoT 2026-08-24 반영 + 이력서 전면 평문화 + 퇴사일 정정

### Restore in 30s — what you were doing / where you got to / what you just finished
my-wiki(SoT)에 2026-08-24 커밋 2건(수집·정제 + **본인 확인 반영**)이 올라와 있었는데 사이트는 "이직 준비 중"에서 멈춰 있었다. 그 격차를 메우고, 근식 지시로 **퇴사일을 고용보험 기준 2026.08.01로 정정**했고, 추가 요청으로 **이력서 전 표면을 평문화**했다.

**끝난 상태 — 배포까지 완료.** 커밋 3건: `44ea8a1`(본 작업, 19파일 +308/−128) · `330bec1`(핸드오프) · `9bd363d`(**프리랜서 항목 제외 — 아래 Decisions 참조**). 전부 `origin/main` 푸시·GitHub Actions "Deploy to GitHub Pages" **success**. 라이브(givepro91.github.io) 5개 페이지 공개 경계 스캔 누출 0건, 사이트맵 `/interview` 0건 유지. **이 세션에서 남은 작업 없음.**

SoT에서 가져온 사실(전부 본인 확인 2026-08-24)과 공개 경계:

| 항목 | 경계 | 사이트 반영 |
|---|---|---|
| **놀곳** 영유아 부모용 지도, 2026-08-15 App Store 배포(무료) | ✅ 공개 승인. **가입자 수·미완 데이터 비율은 투영 금지** | Work 카드 + CV `SOLO_PROJECTS` |
| **탑과 용병단** 유료 게임 ₩3,300, 2026-08-18 출시 | ✅ 공개 승인 · **"호기심 케이스 — 정체성 축과 분리"** | Lab만 (CV 미기재) |
| **도시정비이음**(urbanrenew) | 🔒 고객사 자산·public 금지. 「도시정비이음」은 **발주 업체명** | **최종 미기재** — CAREER에 한 줄 넣었다가 같은 날 제외(`9bd363d`) |
| Coxwave 사전 과제 | 🔒 채용 과제 | 미기재 |
| 정체성 한 줄 | 변경 없음 | 손대지 않음 |

배치는 근식 선택: **놀곳=Work 대표작+CV / 탑=Lab만 / 외주=미기재(최종) / 히어로 상태 배지 현행 유지**.

### Next steps — concrete next actions / blockers / parked
**다음 액션 — 없음.** 커밋·푸시·배포·라이브 검증까지 끝났다. 아래는 완료 기록.
1. ~~커밋·푸시~~ → `44ea8a1`, 명시 경로 19개만 스테이징(`git add .` 미사용), pre-commit 공개 게이트 PASS.
2. ~~`/cv/print` PDF 밀도 확인~~ → **근식이 직접 확인, 문제 없음**(2026-08-24). 핵심 역량 요약 7줄→8줄(`src/pages/cv/print.astro:68`) 유지 확정.
3. **`portfolio/print` 레이아웃은 여전히 unverified** — 텍스트 grep 으로만 검증했고 인쇄 화면은 아무도 안 봤다. 다음에 이 페이지를 건드리면 그때 같이 볼 것.

**블로커 / 이미 시도한 것**
- **`pnpm` 이 이 세션 셸 PATH에 없다.** `corepack`·글로벌 설치·`~/.nvm` 모두 없음을 확인했다. `package.json` 의 `build` 3단계를 `node scripts/check-disclosure.mjs --source && ./node_modules/.bin/astro build && node scripts/check-disclosure.mjs --dist` 로 직접 실행해 대체했다(동일 명령). 근식 셸에선 `pnpm build` 그대로 쓰면 된다.
- **`/cv` 는 JS 스크롤(`window.scrollTo`/`scrollTop`)이 먹지 않는다** — 스크롤스파이가 되돌리는 것으로 보인다(원인 미확정, unverified). 앵커(`/cv/#projects`)와 `orca scroll`(실제 휠 입력)로 우회해 확인했다. **페이지 동작 문제는 아니다.**
- **홈은 `.reveal` 이 IntersectionObserver 기반**이라 즉시 점프하면 빈 화면이 찍힌다. `document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))` 로 강제 노출 후 캡쳐했다.

**파킹 (의도적으로 안 함)**
- `PROJECTS[1].period`(PlanNext `2025.03 – 2026.07`) — 재직 기간이 아니라 프로젝트 기간이고 마지막 출근이 07-24라 그대로 뒀다. 근식에게 알렸고 바꾸라는 지시는 없었다.
- Work 카드·`/roadmap` 의 기술 용어(`서킷브레이커`·`human-in-the-loop`) — 기술 독자용이라 CLAUDE.md 규칙상 허용. 평문화는 이력서 층에 한정.
- `PROJECTS[*].stack` 의 `LLM Serving` 등 — 스택 목록은 평문화 대상 아님.
- SoT 미반영분: `/interview` 봉인본 ↔ 위키 `writing/interviews/` 원본 이중관리 정리(harvest §E-6), 브런치 소속 표기가 아직 "Spacewalk"(4회 연속 미조치).
- dev 서버(4324)는 세션 종료 시 내렸다. 다시 띄울 땐 `pnpm dev`(근식 셸) 또는 `./node_modules/.bin/astro dev`.

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
- ⚠️ **외주는 최종적으로 미기재** (`9bd363d`). 처음엔 CAREER에 한 줄로 넣었으나, 맨 위에 오니 "직전 직장"처럼 읽혀 어색하다는 본인 판단으로 제외했다 — **고용 형태가 다른 일을 회사 경력 목록에 같이 쌓지 않는다.** `PROFILE.current` 의 "프리랜서로 외주 개발도 하고 있습니다" 문장도 함께 제거. **2026.08 이후는 놀곳 App Store 출시로 설명된다.** 별도 섹션 분리안도 검토했으나 항목이 1건뿐이라 빈약해 채택하지 않았다.
- 위 결정의 부수 효과: 고객사 자산 경계(발주처명·도메인·조직명·커밋 수 제외) 판단은 **이제 적용 대상 자체가 없다.** 나중에 외주를 다시 실을 일이 생기면 그 경계부터 다시 세울 것.
- 히어로 상태 배지는 **현행 유지**(근식 선택) — 외주·출시는 본문에서만 드러냄.
- CV에 개인 제품을 넣으려고 `SOLO_PROJECTS` 를 **새 배열로 분리** — 기존 `AX_PROJECTS`(AI 에이전트 운영)에 섞으면 그룹 의미가 깨진다.
- Lab 상태값에 `released` **신설** — 기존 5개(active/prototype/experiment/paused/side)에 출시된 상용 제품을 담을 자리가 없었다.
- 평문화 범위는 **이력서 층(cv.json + /cv + /cv/print + portfolio/print 문장)** 으로 한정, Work 카드·roadmap의 기술 용어는 유지.
- SKILLS 그룹명을 한글화할 땐 `portfolio/print.astro` 의 `group.includes(...)` 조회를 **반드시 같이 고쳐야 한다**(이번에 깨뜨렸다가 고침).
- 한 커밋으로 묶었다 — `cv.json` 안에서 SoT 반영분과 평문화가 같은 문자열들에 얽혀 있어 분리 커밋이 인위적이었다.

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
