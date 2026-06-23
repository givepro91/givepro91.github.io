import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// visibility 의미 (rev.7 정책):
//  - public      : 공개 repo/서비스 → link 노출 가능
//  - anon        : 회사 비공개 / 개인 private → 링크 없이 서사만 (회사명·역할은 노출 OK)
//  - secret-locked: 시크릿 하드코딩 이력 → link 절대 금지
const visibility = z.enum(["public", "anon", "secret-locked"]);

const theme = z.enum([
  "backend",
  "agentops",
  "reliability",
  "proptech",
  "devtools",
]);

const decisionLog = z
  .array(
    z.object({
      why: z.string().min(1), // 왜 이렇게 결정했나
      tradeoff: z.string().optional(), // 트레이드오프 / 포기한 것
      date: z.string().optional(),
    })
  )
  .min(1);

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z
    .object({
      title: z.string(),
      theme,
      kind: z.enum(["work", "side"]).default("work"),
      order: z.number(),
      featured: z.boolean().default(false),
      // 5필드 카드
      positioning: z.string().min(1), // 문제 + 솔루션 한 줄
      shows: z.array(z.string()).min(1), // 증명 역량
      angle: z.string().min(1), // "인용" 후크
      // 서사 5축
      problem: z.string().min(1),
      role: z.string().min(1),
      decision: z.string().min(1),
      result: z.string().min(1),
      learning: z.string().min(1),
      decisionLog,
      // 메타
      stack: z.array(z.string()).optional(), // 보조 (태그/접이식)
      // 공개 제품 화면(이미지/갤러리)은 src/data/galleries.json 으로 분리 (로컬 admin이 R/W)
      period: z.string().optional(),
      metrics: z.string().optional(), // 커밋·규모 등 활동 신호 (자랑 아님)
      visibility,
      link: z.string().url().optional(),
      // Risk Check (rev.7: 시크릿/고객정보/비공개수치 부재 사람 검토)
      riskChecked: z.literal(true),
      riskCheckedBy: z.string(),
      riskCheckedDate: z.string(),
    })
    // 구조 불변식: 비공개는 링크 없음 / secret-locked는 링크 절대 금지
    .refine((d) => d.visibility === "public" || d.link === undefined, {
      message: "visibility가 public이 아니면 link를 둘 수 없습니다 (회사/개인 비공개).",
      path: ["link"],
    })
    .refine((d) => !(d.visibility === "secret-locked" && d.link !== undefined), {
      message: "secret-locked 카드는 link를 가질 수 없습니다 (시크릿 이력).",
      path: ["link"],
    }),
});

// Lab은 src/data/lab.ts(단일 파일)로 이전 — 컬렉션 아님.
export const collections = { projects };
