// Single source of truth for site-wide constants.
// astro.config.ts, OG/canonical meta, JSON-LD, and sitemap all reference these.

export const SITE_URL = "https://givepro91.github.io";

// Google Analytics 4 측정 ID (예: "G-XXXXXXXXXX").
// 발급 후 이 값만 채우면 production 빌드에 자동 삽입된다.
// 빈 값이면 분석 스크립트를 넣지 않음(로컬 dev 빌드도 항상 미삽입 — BaseLayout 가드).
export const GA_MEASUREMENT_ID = "G-GZR4EELM6P";

export const SITE = {
  brand: "Keunsik Works",
  // Hero / identity
  name: "장근식",
  nameEn: "Keun-sik Jang",
  // 정체성 헤드라인 — 어순이 곧 주장이다: 백엔드가 정체(명사) · 제품이 방향 · AI가 부연.
  // 직무명(Product Engineer / AX Lead / FDE)을 박지 않는 건 의도. 지원처가 백엔드/서버/프로덕트/AI로 갈린다.
  // 근거: my-wiki `values/why-product-first-positioning.md` (2026-08-07)
  title: "제품을 만드는 백엔드 엔지니어",
  subtitle: "서버에서 출발해, 문제를 풀 수 있는 데까지",
  // 한 문장 정체성
  tagline:
    "“어디까지가 내 역할인가”가 아니라 “이 문제를 풀려면 어디까지 가야 하는가”로 일합니다. 최근 축은 AI 제품과 운영 자동화.",
  subtagline: "무엇을 만들었나보다, 왜 그렇게 판단했나를 기록합니다.",
  description:
    "장근식(Jay)의 공개 포트폴리오 겸 작업 기록 — 어떤 문제를 어떤 기준으로 풀었는지를 중심으로.",
  locale: "ko",
} as const;

// About 채널 링크 (실값)
// 순서 = About 노출 우선순위 (GitHub 먼저, 컨텐츠 적은 Brunch는 후순위)
export const CHANNELS = [
  { label: "GitHub — givepro91", href: "https://github.com/givepro91" },
  { label: "GitHub — jay-swk", href: "https://github.com/jay-swk" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/근식-장-8620b0199/" },
  { label: "Brunch — 장근식 Jay", href: "https://brunch.co.kr/@eb877c69f69b451" },
] as const;

// 브런치 대표글
export const FEATURED_WRITING = [
  { label: "내 커리어가 다시 움직인 계기", href: "https://brunch.co.kr/@eb877c69f69b451/1" },
  { label: "AI는 내 일을 어떻게 넓혔나", href: "https://brunch.co.kr/@eb877c69f69b451/2" },
] as const;

// 관통 테마 (Work 필터)
export const THEMES = {
  backend: "백엔드 · 플랫폼",
  agentops: "AI 에이전트 운영",
  reliability: "신뢰성 · 안전",
  proptech: "프롭테크",
  devtools: "개발자 도구",
} as const;
export type ThemeKey = keyof typeof THEMES;
