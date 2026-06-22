// Single source of truth for site-wide constants.
// astro.config.ts, OG/canonical meta, JSON-LD, and sitemap all reference these.

export const SITE_URL = "https://givepro91.github.io";

export const SITE = {
  brand: "Keunsik Works",
  // Hero / identity
  name: "장근식",
  nameEn: "Keun-sik Jang",
  title: "AX Product · Engineering Lead",
  // 한 문장 정체성
  tagline:
    "AI를 붙이는 개발자가 아니라, AI가 안전하게 일할 수 있는 운영 구조를 설계하는 사람.",
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
