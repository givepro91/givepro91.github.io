// English CV presentation layer. Keep dates, employers, products, and outcomes aligned with cv.json.
export type EnglishLink = { label: string; href: string };

export type EnglishExperience = {
  company: string;
  role: string;
  period: string;
  summary?: string;
  bullets?: string[];
  stack?: string[];
};

export type EnglishProject = {
  name: string;
  period: string;
  role: string;
  summary: string;
  bullets: string[];
  stack: string[];
  links?: EnglishLink[];
};

export const EN_PROFILE = {
  name: "Keun-sik Jang",
  koreanName: "장근식",
  title: "Engineer building AI products from a backend foundation",
  subtitle: "Backend is the foundation. Products are the direction.",
  location: "South Korea",
  email: "givepro91@gmail.com",
  photo: "/cv/profile.jpg",
  summary:
    "Engineer who started in backend systems and now builds AI products. Over the past decade, I have worked across service architecture, asynchronous processing, data pipelines, infrastructure, and product delivery. I work from the question, “How far does this problem need me to go?”—from backend foundations to user-facing product, operations, and release.",
  links: [
    { label: "GitHub", href: "https://github.com/givepro91" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/%EA%B7%BC%EC%8B%9D-%EC%9E%A5-8620b0199/" },
    { label: "Portfolio", href: "https://givepro91.github.io" },
  ] satisfies EnglishLink[],
};

export const EN_EXPERIENCE: EnglishExperience[] = [
  {
    company: "Spacewalk, Inc.",
    role: "Technical Product Lead / Backend & Product Team",
    period: "Jan 2023 – Aug 2026",
    summary: "Joined as a backend engineer and expanded into team leadership and technical product delivery.",
    bullets: [
      "Developed and operated the Landbook backend across authentication, payments, subscriptions, parcel services, and gateways. Reworked blocking calls and sequential notifications so one slow service would not hold up the rest of the system, and led the row-house redevelopment analysis service for deployment inside LH's internal network.",
      "Led PlanNext.AI from planning through development and deployment, then expanded it into PlanNext Retail: site analysis, strategy options, 2D/3D automated design, validation, and DXF export.",
      "Built the infrastructure and application flow for PlanReview, separating web intake from long-running document analysis with a queue. Kept analysis results consistent across the product and added deployment checks after a configuration mistake reached production.",
      "Standardized server access, secrets management, and AI-assisted operations so agents could inspect infrastructure and documentation but needed human approval before making changes.",
      "Built an internal operations console and led the move from cloud infrastructure to company-owned servers, reducing AWS costs to roughly one tenth. Also led code review, documentation, release processes, and onboarding for the backend team.",
    ],
    stack: ["Kotlin", "Spring Boot", "WebFlux", "Coroutines", "Kafka", "Redis", "PostgreSQL", "AWS EKS", "Python", "FastAPI"],
  },
  {
    company: "Peoplely, Inc.",
    role: "Manager / Product & Engineering Lead",
    period: "Mar 2021 – Dec 2022",
    summary: "Planned, built, and operated an exhibition audio-guide platform and exhibition-linked commerce, while leading a small team.",
    bullets: [
      "Developed and maintained Qpicker, an exhibition audio-guide platform with a React Native app and admin back office. Integrated Firebase and payment services; the product reached 100K+ cumulative downloads and supported a Haribo Asia exhibition contract.",
      "Planned and built the After Museum commerce platform, including REST APIs and payments, and delivered the MVP and AWS deployment within one month. Built CI/CD with Jenkins and Bitbucket and led a 3–5 person team.",
    ],
    stack: ["Spring Boot", "Java", "REST API", "JWT", "Jenkins", "MariaDB", "Firebase"],
  },
  {
    company: "Taejeon Pharm Sales Co., Ltd.",
    role: "Assistant Manager, Digital Strategy",
    period: "Jun 2020 – Mar 2021",
    summary: "Built commerce backend services and ERP integrations for a health-supplement platform.",
    bullets: [
      "Developed product, order, delivery, payment-state, and back-office features, and automated product and order synchronization between the ERP and storefront.",
    ],
    stack: ["Java", "Spring Boot", "ERP Integration"],
  },
  {
    company: "Apsun Group",
    role: "Web Developer / Strategic Planning",
    period: "Nov 2018 – Dec 2019",
    summary: "Led planning, development, operations, and deployment for brand web and mobile services, including an integrated admin system.",
  },
  {
    company: "PassNJoy",
    role: "Software Engineer",
    period: "Apr 2017 – Jan 2018",
    summary: "Developed and operated a travel and ticketing platform across payments, reservations, cancellations, inventory, and back-office tools.",
  },
  {
    company: "Cheongju Gyocaro",
    role: "Software Engineer / R&D Team",
    period: "Feb 2016 – Nov 2016",
    summary: "Developed and operated a regional online information service and internal data-management tools.",
  },
];

export const EN_PERSONAL_PRODUCTS: EnglishProject[] = [
  {
    name: "Tower & Mercenaries",
    period: "Jun 2026 – Aug 2026",
    role: "Solo Product Builder · Paid iOS Game",
    summary: "A party-management game where players recruit mercenaries and climb a tower while watching automated battles.",
    bullets: [
      "Planned, built, released, and promoted the product alone; handled Apple Developer registration, review, pricing, and release operations.",
      "Released at ₩3,300 on Aug 18, 2026. Ten days later it reached #3 among all paid games and #1 in RPG on the Korean App Store; the same snapshot showed 115 daily downloads and two ratings. Added deterministic combat conditions for reproducible balancing and published a free web demo without ad spend.",
    ],
    stack: ["TypeScript", "Vite", "React", "Zustand", "Tauri · iOS"],
    links: [
      { label: "App Store", href: "https://apps.apple.com/kr/app/id6801980968" },
      { label: "Case study", href: "/portfolio/tower-mercenaries/" },
    ],
  },
  {
    name: "Nolgot",
    period: "Aug 2026",
    role: "Solo Product Builder · Parenting Map",
    summary: "A map app that helps parents of young children find a place they can actually visit today within 30 seconds.",
    bullets: [
      "Owned planning, development, data collection, App Store review, and release. Collected practical details that public datasets do not provide and reduced first-screen response time from 2,289–4,415ms to 18–29ms after reproducing a user report.",
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "Capacitor · iOS", "Vercel"],
    links: [{ label: "App Store", href: "https://apps.apple.com/kr/app/id6801715002" }],
  },
];

export const EN_SELECTED_PROJECTS: EnglishProject[] = [
  {
    name: "PlanNext Retail · PlanNext.AI",
    period: "Mar 2025 – Jul 2026",
    role: "Product Lead · Backend / Infrastructure / AI Serving",
    summary: "An AI retail-design product that analyzes a site, proposes store strategies, generates 2D/3D layouts, and exports drawings.",
    bullets: [
      "Separated conversational AI from structured design data so the 2D view, 3D view, and DXF export stayed aligned.",
      "Turned the design API into a paid product with authentication, plans, usage history, and queued long-running jobs.",
    ],
    stack: ["Kotlin", "Spring Boot", "Coroutines", "Kafka", "Redis", "LLM Serving", "AWS EKS"],
    links: [
      { label: "Product", href: "https://retail.plannext.ai/ko" },
      { label: "Decision log", href: "/work/plannext-retail/" },
    ],
  },
  {
    name: "PlanReview",
    period: "2026",
    role: "Infrastructure & Application Lead",
    summary: "A service that checks architectural drawings against regulations after a user uploads a PDF.",
    bullets: [
      "Separated the web request path from long-running analysis with a queue so document processing would not slow the product down.",
      "Kept the analysis engine's result consistent across every view and added automated deployment checks after a production configuration failure.",
    ],
    stack: ["TypeScript", "Hono", "Prisma", "Redis", "Next.js", "Python", "Docker"],
    links: [{ label: "Decision log", href: "/work/planreview/" }],
  },
  {
    name: "Landbook · Row-house Redevelopment",
    period: "2023 – 2026",
    role: "Backend Engineer",
    summary: "A PropTech platform that analyzes buildable area and project profitability from land and regulatory data.",
    bullets: [
      "Joined an existing service-oriented backend and improved non-blocking communication and parallel notification delivery.",
      "Led the row-house redevelopment analysis backend and adapted it for secure deployment inside a public-agency network.",
    ],
    stack: ["Kotlin", "Spring Boot", "WebFlux", "Coroutines", "Ruby on Rails", "PostgreSQL", "PostGIS"],
    links: [
      { label: "Product", href: "https://landbook.net" },
      { label: "Decision log", href: "/work/landbook-msa/" },
    ],
  },
  {
    name: "Nova",
    period: "2026",
    role: "Solo Builder · Open Source",
    summary: "A Claude Code plugin that separates code generation from independent evaluation before changes are committed.",
    bullets: [
      "Made review a required path rather than a recommendation, using separate roles and hooks so unreviewed code cannot be committed.",
    ],
    stack: ["Claude Code Plugin", "MCP", "TypeScript", "Bash"],
    links: [
      { label: "GitHub", href: "https://github.com/jay-swk/nova-landing" },
      { label: "Decision log", href: "/work/nova/" },
    ],
  },
  {
    name: "Ground Control",
    period: "2026",
    role: "Solo Builder · Infrastructure Agent",
    summary: "An infrastructure agent that narrows down causes of incidents and asks the owner before taking action.",
    bullets: [
      "Designed a workflow that keeps the final decision with a human and reports confidence as clear, suspected, or hypothetical rather than unsupported percentages.",
    ],
    stack: ["Python", "FastAPI", "Claude Code CLI", "Slack Bolt", "AWS"],
    links: [{ label: "Decision log", href: "/work/ground-control/" }],
  },
  {
    name: "Realty Data Pipeline",
    period: "2026",
    role: "Backend Contributor · Data Reliability",
    summary: "A monthly nationwide real-estate data pipeline designed to recover cleanly from blocks, errors, and interruptions.",
    bullets: [
      "Added backoff, circuit-breaking, and administrative-district checkpoints so collection could slow down safely and resume from the interrupted point.",
    ],
    stack: ["Python", "PostgreSQL", "requests", "Slack"],
    links: [{ label: "Decision log", href: "/work/realty-data-pipeline/" }],
  },
];

export const EN_SKILLS = [
  { label: "Backend & Architecture", items: ["Kotlin", "Java", "Ruby", "Spring Boot", "WebFlux", "Coroutines", "REST APIs", "Service-oriented systems"] },
  { label: "AI Product & Operations", items: ["AI product delivery", "LLM serving", "Human approval flows", "Agent operations", "Claude Code", "MCP"] },
  { label: "Cloud & Infrastructure", items: ["AWS", "EKS", "Kubernetes", "Docker", "Argo CD", "Argo Workflows", "Linux", "Kafka"] },
  { label: "Data & Reliability", items: ["PostgreSQL", "PostGIS", "Redis", "Data pipelines", "Backoff and circuit breaking", "Checkpoints and recovery"] },
];

export const EN_EDUCATION = {
  school: "Korea National University of Transportation",
  degree: "B.S. in Software Engineering",
  period: "2009 – 2016",
};
