#!/usr/bin/env node
// Grant Works — disclosure gate (rev.7).
// 회사명은 스캔하지 않는다(노출 허용). 진짜 시크릿만 차단한다.
//   node scripts/check-disclosure.mjs --source   # 추적/소스 텍스트 스캔 (build 전)
//   node scripts/check-disclosure.mjs --dist      # 빌드 산출물(dist/) 스캔 (build 후)
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, relative } from "node:path";

const ROOT = process.cwd();
const mode = process.argv.includes("--dist") ? "dist" : "source";

// 차단 = 진짜 시크릿 패턴 (보수성 아님 = 기본 보안)
const SECRET_PATTERNS = [
  { name: "Slack webhook", re: /hooks\.slack\.com\/services\/[A-Za-z0-9/_-]+/ },
  { name: "ngrok URL", re: /\b[\w-]+\.ngrok(?:-free)?\.(?:io|app|dev)\b/ },
  { name: "AWS access key", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "private key block", re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  {
    name: "credential assignment",
    re: /\b(password|passwd|secret|api[_-]?key|access[_-]?token|bearer)\b\s*[:=]\s*["'][^"'\s]{8,}["']/i,
  },
  { name: "GitHub token", re: /\bgh[pousr]_[A-Za-z0-9]{30,}\b/ },
];

// REVIEW(비차단): 외부 링크 호스트 화이트리스트 — 그 외는 사람 검토 권고
const LINK_ALLOW = [
  "givepro91.github.io",
  "github.com/givepro91",
  "github.com/jay-swk",
  "zippit.im",
  "brunch.co.kr",
  "linkedin.com",
  "docs.anthropic.com",
  // infra / standards (no review needed)
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "schema.org",
  "www.w3.org",
  "astro.build",
  "cdn.jsdelivr.net",
];

const TEXT_EXT = new Set([
  ".md", ".mdx", ".astro", ".ts", ".tsx", ".js", ".mjs", ".cjs",
  ".json", ".css", ".scss", ".yml", ".yaml", ".html", ".txt", ".xml",
  ".webmanifest", ".rss", ".svg",
]);
// 스캔 제외 디렉토리 (.github 는 스캔 유지)
const SKIP_DIR = new Set([
  ".git", "node_modules", ".astro", "dist", ".omc",
  ".playwright-mcp", ".nova", ".vscode",
  // private/ = 면접 준비 원문(평문). gitignore 대상이라 배포에 포함되지 않는다.
  "private",
]);

function walk(dir, out = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR.has(ent.name)) continue;
    const full = join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (TEXT_EXT.has(extname(ent.name))) out.push(full);
  }
  return out;
}

const base = mode === "dist" ? join(ROOT, "dist") : ROOT;
if (mode === "dist" && !existsSync(base)) {
  console.error("✖ dist/ 가 없습니다. 먼저 빌드하세요.");
  process.exit(1);
}

const files = walk(base);
const violations = [];
const reviews = [];

for (const f of files) {
  let text;
  try { text = readFileSync(f, "utf8"); } catch { continue; }
  const rel = relative(ROOT, f);
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    for (const p of SECRET_PATTERNS) {
      if (p.re.test(line)) violations.push(`${rel}:${i + 1}  [${p.name}]`);
    }
    // 외부 링크 REVIEW (소스 단계만)
    if (mode === "source") {
      const urls = line.match(/https?:\/\/[^\s"'`)>\]]+/g) || [];
      for (const u of urls) {
        const host = u.replace(/^https?:\/\//, "");
        if (!LINK_ALLOW.some((a) => host.startsWith(a) || host.includes("/" + a) || host.startsWith(a.split("/")[0]))) {
          if (!LINK_ALLOW.some((a) => host.includes(a))) reviews.push(`${rel}:${i + 1}  ${u}`);
        }
      }
    }
  });
}

if (violations.length) {
  console.error(`\n✖ disclosure 게이트 FAIL (${mode}) — 시크릿 패턴 ${violations.length}건:`);
  for (const v of violations) console.error("  - " + v);
  console.error("\n시크릿(webhook/ngrok/키/credential)은 포트폴리오에서 차단됩니다. 제거 후 재시도하세요.");
  process.exit(1);
}

console.log(`✔ PASS (${mode}): 알려진 시크릿 패턴 미발견.`);
console.log("  ⚠ 누출 부재 증명 아님 — 카드별 Risk Check(고객정보·비공개 수치·재식별 디테일) 필수.");
if (mode === "source" && reviews.length) {
  const uniq = [...new Set(reviews)];
  console.log(`\n  REVIEW(비차단): allowlist 외 외부 링크 ${uniq.length}건 — 사람 검토 권고:`);
  for (const r of uniq.slice(0, 30)) console.log("    · " + r);
}
process.exit(0);
