# CV 두 축 전면 재구조 — 설계 스펙

작성: 2026-06-30 · 근거: Josh(조성현) 이직 자문 + 정체성 SoT(`jay-swk/social-portfolio-os`) + 현재 사이트 데이터

## 배경 / 문제

Josh 자문의 핵심: 채용 시 두 가지가 읽혀야 한다.
- **① AI Operations & Agent Infrastructure** — 경험한 사람이 드문 **차별점**. 개인이 아니라 **조직/팀 차원**으로 AI화 기반을 깐 것. 경영자가 비용·거버넌스 관점에서 주목.
- **② AI Full-Stack Product Engineering** — 기본기. LLM 결합 제품(retail.plannext.ai 데모·planreviewer 캡쳐가 강력 증거). Landbook/LBD는 상용 참조.

**현재 사이트의 갭**: ②는 잘 들어가 있으나, ①의 **회사 차원 증거(접근·시크릿 표준화·지식 SoT·비용 절감·백업)가 스페이스워크 경력에 한 줄도 없음**. 에이전트 작업(Nova·GC·MIRIVA)은 전부 "개인 프로젝트"로만 프레이밍돼 Josh가 경계한 "개인 차원"으로 읽힌다.

## 확정된 결정 (사용자 승인)

1. **범위** = 두 축 전면 재구조 (헤드라인+요약+경력+프로젝트 프레임).
2. **헤드라인** = `Technical Product Lead` / 부제 `AI Operations & Agent Infrastructure` / 도메인 태그 `PropTech × AI`.
3. **공개 수위** = 구체적으로 쓰되 **실제 절대 금액만 비노출**. 비율(예: "10분의 1 수준")·상용 기술명(Tailscale·1Password·LXD·ZFS) OK. 내부 코드네임(LLM-Wiki·Harness·Hermes)은 일반화.
4. **②축 라벨** = `AI Full-Stack Product Engineering` 유지. 단 본문은 "풀스택이 됐다"가 아니라 "기획~LLM Serving까지 끝까지 제품화"로 표현(SoT 피할표현 회피).
5. **②축 증거(retail 데모·planreviewer 캡쳐)** = 자료 미확보 → 이번엔 자리만, 추후 보강.

## 변경 대상 파일

| 파일 | 변경 |
|---|---|
| `src/config.ts` | `SITE.title` → "Technical Product Lead", `SITE.subtitle`(신규) 추가, `SITE.tagline` 갱신 |
| `src/data/cv.json` | `PROFILE.title`/`subtitle`(신규)/`summary` 갱신, `CAREER[0]`(스페이스워크) summary+highlights 재구조, `SKILLS` 일부 ① 항목 보강 |
| `src/data/cv.ts` | `CareerEntry`/`PROFILE` 타입에 `subtitle` 반영(필요 시), `PROFILE` re-export 확인 |
| `src/pages/index.astro` | 히어로 `p-title` 아래 subtitle 라인 노출 |
| `src/pages/cv/index.astro` | 헤드 `cv-sub` = title · subtitle, Projects 그룹 note 재프레임 |
| `src/pages/cv/print.astro` | (검증) 새 구조가 PDF에서 깨지지 않게 확인 |
| `src/pages/portfolio/print.astro` | (검증) 동일 |

## 구체 문구 (정본)

### 헤드라인
- `SITE.title` / `PROFILE.title` = **Technical Product Lead**
- `SITE.subtitle` / `PROFILE.subtitle` = **AI Operations & Agent Infrastructure**
- `PROFILE.domain` = **PropTech × AI** (유지, 인포박스용)

### tagline (config.ts)
> AI를 붙이는 개발자가 아니라, **조직 전체가 AI와 안전하게 일할 수 있는 운영 구조**를 — 개인이 아니라 팀 차원으로 — 설계하는 사람.

### PROFILE.summary (3문단)
1. AI를 붙이는 게 아니라, 조직 전체가 AI와 안전하게 일할 수 있는 운영 구조를 설계합니다 — 개인이 아니라 팀 차원으로.
2. 10년차 백엔드 엔지니어링(WebFlux 기반 MSA·Kafka·Redis·EKS)을 토대로 두 축으로 일합니다. **① AI Operations & Agent Infrastructure** — 접근·시크릿·승인 게이트·지식 SoT·비용까지, 조직이 AI 에이전트와 안전하게 일하는 운영 기반을 회사 차원으로 표준화합니다. **② AI Full-Stack Product Engineering** — AI 부동산·건축 제품을 기획부터 UI/UX·백엔드·인프라·LLM Serving까지 끝까지 제품화합니다.
3. ‘AI를 붙였다’가 아니라 ‘문제 정의 → 현업 흐름 → AI·자동화 설계 → 운영 안전장치 → 성과 측정 → 재사용 패턴화’를 한 사이클로 만드는 일을 지향합니다.

### CAREER[0] 스페이스워크 — summary
> 백엔드 엔지니어로 입사해 백엔드 팀 리딩과 Technical Product Lead로 역할을 넓히며 두 축으로 일했습니다 — ① 조직이 AI 에이전트와 안전하게 일하는 운영 기반(접근·시크릿·승인·지식 SoT·비용)을 회사 차원으로 표준화하고, ② AI 부동산·건축 제품(PlanReview·PlanNext.AI·Landbook)을 기획부터 LLM Serving까지 끝까지 제품화했습니다.

### CAREER[0] 스페이스워크 — highlights (순서: ① 4줄 → ② 3줄 → 팀리딩 1줄)
1. **① 인프라 접근·시크릿 표준화** — 파편화된 PEM 키 서버 접근을 Tailscale SSH 통합 구조로 전환하고 Google Workspace 계정 기반 개인별 권한을 설계. 흩어진 시크릿·API 키는 1Password로 통합하고 그룹별 Service Account로 권한을 분리.
2. **① Human-in-the-Loop 운영** — 에이전트가 인프라 상태·운영 문서를 참조해 자율적으로 진단하되, 실제 변경은 사람이 승인하는 안전장치를 표준화.
3. **① 지식 SoT · 사내 에이전트 플랫폼** — 분산된 인프라·운영 지식을 LLM 친화 위키(SoT)로 정리하고, 사내 공용 스킬·지식 체계를 통합해 조직 전체가 일관된 방식으로 AI를 활용하도록 기반화.
4. **① 인프라 비용·안정성 재설계** — 비용·서버·리포를 추적하는 사내 콘솔과 LXD 온프레미스로 안정성을 유지하며 AWS 비용을 10분의 1 수준으로 절감하고, ZFS 스냅샷·이중 백업으로 복구 가능성을 강화.
5. **② PlanReview** — 건축 도면(PDF) 규정 적합성을 업로드 한 번으로 자동 검토하는 SaaS. 인프라부터 개발 전반을 맡아 web→server→큐→worker 비동기 파이프라인을 구축하고, ‘엔진을 단일 진실원으로 두고 프론트 보정·재분류를 금지’하는 경계와 배포 가드레일을 설계(현재 자문).
6. **② PlanNext.AI** — LLM 기반 오피스 가구 배치 설계 API를 기획·개발·배포까지 주도. Coroutine 비동기·Kafka 요청 분리·Redis 인증/요금제/사용량으로 상품화하고 EKS·Argo Workflow로 운영.
7. **② Landbook·가로주택정비(LBDeveloper)** — 인증·결제·구독·필지·게이트웨이를 Kotlin/Spring MSA로 설계·운영한 백엔드 토대. Kafka 격리·Coroutine 비동기로 병목·장애를 끊고, LH 등 공공기관 설치형 보안(프록시·방화벽·접근제어)과 PostGIS 공간 연산을 대응.
8. **백엔드 팀 리딩** — 코드 리뷰 체계·기술 문서화·배포/운영 프로세스 정립, 신규 입사자 온보딩으로 팀의 반복 업무를 줄임.

### /cv Projects 그룹 — AX 그룹 note 재프레임
> 회사 차원에서 깐 거버넌스·운영 원리를 외부 의존 0의 재사용 가능한 제품으로 증명 — AI 에이전트 통제·검증(Nova·Ground Control)부터 운영 누락 방지·무중단 데이터 파이프라인(MIRIVA·Realty)까지 단독 설계·구현(일부 OSS 공개).

### SKILLS 보강 (① 정렬)
- "운영 자동화 · 데이터 신뢰성" 그룹 또는 "Cloud & Infrastructure" 그룹에 추가:
  - 인프라 접근·시크릿 표준화 (Tailscale SSH · 1Password · 그룹별 Service Account)
  - 온프레미스·비용 관측 (LXD · ZFS 스냅샷/이중 백업)

## 비목표 (YAGNI)

- retail.plannext.ai 데모 임베드·planreviewer 캡쳐 (자료 미확보 — 추후).
- 디자인/레이아웃 변경 (subtitle 한 줄 노출 외 시각 변경 없음).
- 과거 경력(피플리 이하) 본문 수정.
- 직전 핸드오프의 미결 항목("결정 로그" 라벨·"A가 아니라 B" 구문 등) — 별건.

## 검증

- `pnpm build` PASS (disclosure 게이트 source+dist 통과 = 시크릿 0).
- `/`(홈 히어로 subtitle), `/cv`(Overview·Career ①/② 구조), `/cv/print`·`/portfolio/print`(PDF 무분할) 육안.
- `grep` 으로 절대 금액·연봉 미노출 확인.
