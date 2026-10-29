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
    { label: "LinkedIn", href: "https://www.linkedin.com/in/keunsik-jang/" },
    { label: "Portfolio", href: "https://givepro91.github.io" },
  ] satisfies EnglishLink[],
};

export const EN_EXPERIENCE: EnglishExperience[] = [
  {
    company: "AARO",
    role: "Part-time Consultant / Server, Infrastructure & Operations for an AI Architectural Design Platform",
    period: "Sep 2026 – Present",
    summary: "Consulting on servers, infrastructure, and operating practices for a team building an AI architectural design platform.",
    bullets: [
      "Set up a single home for working practices, decision records, and operating documents, and am building the internal operations console that runs on them (TypeScript · Next.js).",
      "Building a tool that replaces copying an app for every client: once a client's materials are organized into one configuration, that client's design portal is generated. People only handle exceptions such as checking materials and making the final call, and a deployment is deleted and halted if an address that must stay private becomes public.",
    ],
    stack: ["TypeScript", "Next.js"],
  },
  {
    company: "Dosi Jeongbi Ieum",
    role: "Freelancer / Development & Operations of an Association Work Platform",
    period: "Aug 2026 – Present",
    summary: "Developing and operating a work platform used by redevelopment and reconstruction associations.",
    bullets: [
      "Runs accounting ledgers, expense approvals, monthly documents and reports (PDF · Excel), and scheduling on one platform in production.",
      "Enforced role-based permissions on the server and required two people to approve hard-to-reverse deletions.",
      "Take client feedback as numbered tasks and ship it in short cycles (six deployments between Oct 16 and 28, 2026), updating the user manual in the same change whenever a screen changes.",
    ],
    stack: ["TypeScript", "Hono", "SQLite", "AWS"],
  },
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
    period: "Jun 2026 – Present",
    role: "Solo Product Builder · Paid iOS Game",
    summary: "A party-management game where players recruit mercenaries and climb a tower while watching automated battles.",
    bullets: [
      "Planned, built, released, and promoted the product alone; handled Apple Developer registration, review, pricing, and release operations.",
      "Released at ₩3,300 on Aug 18, 2026. Two weeks later it reached #2 among all paid games and #1 in RPG on the Korean App Store, with a 4.0 rating across 24 reviews and no ad spend. After adding Traditional Chinese, it reached #1 among all paid games on the Taiwan App Store (Oct 7, 2026). Added deterministic combat conditions for reproducible balancing and published a free web demo.",
      "Kept shipping after launch: moved the engine to Godot in 1.19.1 to cut device heat, then shipped through 1.24.1 by late Oct 2026, operated in Korean, English, Japanese, and Traditional Chinese. Patched an iOS 27 launch crash and reported the underlying scene-lifecycle fix upstream.",
    ],
    stack: ["TypeScript", "React", "Godot", "iOS"],
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
  {
    name: "Climb Crew: Survivors · Belkar: Black Hunter",
    period: "Sep 2026 – Present",
    role: "Solo Product Builder · Two Mobile Releases",
    summary: "Two mobile products taken from first commit through App Store review in nine and six days respectively, released on Sep 23 and Sep 28, 2026, and both on Google Play in October.",
    bullets: [
      "Put automated checks and on-device measurement in place before moving fast: roughly 320 regression assertions across three suites, so a build could ship without a manual pass.",
      "Measured instead of assuming. Built the pre-change build in a separate worktree and ran it under identical conditions, which showed an apparent improvement was pre-existing difficulty rather than the fix.",
      "Turned a vague user report (\"enemies cleared but the stage will not advance\") into a number: 12–13% of spawn points were pushed outside the playable area, which led to replacing pathfinding.",
      "Reused an earlier product's setting while writing the IP boundary document before any code, separating what carries over from what must not, in both directions.",
    ],
    stack: ["Godot", "Unity", "C#", "Firebase", "iOS", "Android"],
    links: [{ label: "App Store", href: "https://apps.apple.com/kr/app/id6815152175" }],
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
