#!/usr/bin/env node
/**
 * /cv/resume 검사 두 가지:
 *   (1) 시트 넘침 — 시트 하나가 A4 를 넘기면 PDF 가 한 장 더 나온다.
 *   (2) 화면 = PDF — 화면 렌더와 인쇄 렌더의 요소 위치·크기·폰트·**색**이 같은지.
 *
 * (2)가 필요한 이유: global.css 의 사이트 전역 @media print 블록이 :root 토큰
 * (--accent 등)을 인쇄용으로 바꾼다. 이 페이지가 그걸 물려받으면 인쇄할 때만 색이
 * 달라진다(실제로 액센트가 #2563eb → #1a3f9c 로 새던 적 있음). 좌표만 봐서는 안 잡힌다.
 *
 * 이 페이지는 페이지 나눔을 브라우저 추론에 맡기지 않고 <Sheet> 로 직접 배치한다.
 * 그래서 내용이 조금만 늘어도 시트 하나가 A4 를 넘겨 PDF 가 한 장 더 나올 수 있는데,
 * 화면만 봐서는 티가 안 난다(화면 시트는 min-height 라 그냥 길어진다). 그걸 잡는다.
 *
 *   node scripts/check-resume-pages.mjs          # dist 를 띄워서 검사
 *   node scripts/check-resume-pages.mjs --url http://localhost:4321/cv/resume/
 *
 * 로컬 Chrome 이 필요해서 `pnpm build` 게이트에는 넣지 않았다(CI 러너에 Chrome 없음).
 * 시트를 옮기거나 cv.json 을 고친 뒤에는 직접 돌릴 것.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const A4_PX = (297 / 25.4) * 96; // 1122.52
// 측정 뷰포트는 실제 인쇄와 같은 A4 폭이어야 한다 — 넓게 잡으면 반응형 분기가 달라져 헛measure.
const A4_W_PX = Math.round((210 / 25.4) * 96); // 794
const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".xml": "application/xml" };

const argUrl = process.argv.includes("--url") ? process.argv[process.argv.indexOf("--url") + 1] : null;

async function findChrome() {
  for (const p of CHROME_CANDIDATES) {
    try { await stat(p); return p; } catch {}
  }
  return null;
}

/** dist/ 를 그대로 서빙 (Astro 는 format: directory 라 /cv/resume/ → index.html) */
async function serveDist(root) {
  const server = createServer(async (req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    const file = join(root, p);
    try {
      const body = await readFile(file);
      res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  return { server, port: server.address().port };
}

async function cdp(chrome, url) {
  const port = 9400 + Math.floor(process.pid % 500);
  const proc = spawn(chrome, [
    "--headless", "--disable-gpu", "--no-sandbox", "--no-first-run",
    `--remote-debugging-port=${port}`, `--window-size=${A4_W_PX},1000`, "about:blank",
  ], { stdio: "ignore" });

  let targets = null;
  for (let i = 0; i < 40 && !targets; i++) {
    await new Promise((r) => setTimeout(r, 250));
    try { targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch {}
  }
  if (!targets) { proc.kill(); throw new Error("Chrome 디버깅 포트에 붙지 못했습니다."); }

  const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) =>
    new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  await new Promise((r) => ws.addEventListener("open", r));
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  });

  await send("Page.enable");

  /** 시트 기준 상대좌표 + 폰트 + 색을 모아 지문을 만든다 */
  const FINGERPRINT = `(() => {
    const out = [];
    document.querySelectorAll('.rz-sheet').forEach((sh, si) => {
      const base = sh.getBoundingClientRect();
      sh.querySelectorAll('.rz-row, .rz-entry, .rz-title, .rz-lede, .rz-bullets li, .rz-chip, .rz-quote, .rz-label, .rz-axis, .rz-meta-link, .rz-callout, .rz-callout-lead, .rz-callout-u, .rz-stack, .rz-period').forEach(el => {
        const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
        out.push([si, el.className.split(' ')[0],
          Math.round(r.left - base.left), Math.round(r.top - base.top),
          Math.round(r.width), Math.round(r.height),
          cs.fontSize, cs.lineHeight,
          cs.color, cs.backgroundColor, cs.borderTopColor, cs.borderLeftColor].join('|'));
      });
    });
    return JSON.stringify(out);
  })()`;

  async function snap(media, vw) {
    // 화면은 종이(210mm)가 통째로 들어가는 넓은 뷰포트에서, 인쇄는 실제 인쇄 뷰포트(A4 폭)에서.
    // 인쇄 뷰포트가 794px 이라 모바일 분기(screen and max-width)가 걸리면 안 된다.
    await send("Emulation.setDeviceMetricsOverride", { width: vw, height: 1000, deviceScaleFactor: 1, mobile: false });
    await send("Emulation.setEmulatedMedia", { media });
    await send("Page.navigate", { url });
    await new Promise((r) => setTimeout(r, 3000)); // 웹폰트까지 반영
    const heights = await send("Runtime.evaluate", {
      expression: `JSON.stringify([...document.querySelectorAll('.rz-sheet')].map(s => s.getBoundingClientRect().height))`,
      returnByValue: true,
    });
    const fp = await send("Runtime.evaluate", { expression: FINGERPRINT, returnByValue: true });
    return { heights: JSON.parse(heights.result.value), fp: JSON.parse(fp.result.value) };
  }

  const print = await snap("print", A4_W_PX);
  const screen = await snap("screen", 1300);
  ws.close();
  proc.kill();
  return { print, screen };
}

const chrome = await findChrome();
if (!chrome) {
  console.error("⚠ SKIP: 로컬 Chrome 을 찾지 못했습니다 — 시트 검사를 건너뜁니다.");
  process.exit(0);
}

let server = null;
let url = argUrl;
if (!url) {
  const root = resolve("dist");
  try { await stat(join(root, "cv/resume/index.html")); }
  catch { console.error("✗ dist/cv/resume/index.html 이 없습니다. 먼저 빌드하세요."); process.exit(1); }
  const s = await serveDist(root);
  server = s.server;
  url = `http://127.0.0.1:${s.port}/cv/resume/`;
}

const { print, screen } = await cdp(chrome, url);
server?.close();
const heights = print.heights;

if (heights.length === 0) {
  console.error("✗ .rz-sheet 을 찾지 못했습니다.");
  process.exit(1);
}

let bad = 0;
let tight = 0;
console.log(`A4 한 장 = ${Math.round(A4_PX)}px · 시트 ${heights.length}장`);
heights.forEach((h, i) => {
  const slack = A4_PX - h;
  const pct = Math.round((100 * h) / A4_PX);
  let mark = `✓ 여유 ${Math.round(slack)}px`;
  if (slack < 0) { mark = `✗ ${Math.round(-slack)}px 넘침 — PDF 가 한 장 더 나옵니다`; bad++; }
  else if (slack < 30) { mark = `△ 여유 ${Math.round(slack)}px — 너무 빠듯합니다`; tight++; }
  console.log(`  시트 ${i + 1}: ${String(Math.round(h)).padStart(5)}px (${String(pct).padStart(3)}%)  ${mark}`);
});

// ── 화면 = PDF ────────────────────────────────────────────────
console.log(`\n화면 렌더 vs 인쇄 렌더 — 요소 ${screen.fp.length}개 대조`);
let drift = 0;
if (screen.fp.length !== print.fp.length) {
  console.error(`  ✗ 요소 수가 다릅니다 (화면 ${screen.fp.length} / 인쇄 ${print.fp.length})`);
  drift++;
} else {
  const diffs = [];
  for (let i = 0; i < screen.fp.length; i++) if (screen.fp[i] !== print.fp[i]) diffs.push([screen.fp[i], print.fp[i]]);
  drift = diffs.length;
  for (const [a, b] of diffs.slice(0, 6)) console.error(`  ✗ 화면 ${a}\n    인쇄 ${b}`);
  if (diffs.length > 6) console.error(`  … 외 ${diffs.length - 6}건`);
}
if (!drift) console.log("  ✓ 위치·크기·폰트·색 전부 동일");

if (bad || drift) {
  if (bad) console.error(`\n✗ FAIL: ${bad}개 시트가 A4 를 넘칩니다. 넘친 항목을 다음 <Sheet> 로 옮기세요 (src/pages/cv/resume.astro).`);
  if (drift) console.error(`\n✗ FAIL: 화면과 인쇄가 ${drift}건 다릅니다. resume.css 에 인쇄 전용 오버라이드를 넣지 마세요. 색이 다르면 global.css 의 @media print 가 :root 토큰을 바꾸는 것이니, 그 토큰을 .rz-page 에서 다시 못박으세요.`);
  process.exit(1);
}
console.log(`\n✔ PASS: 모든 시트가 A4 한 장에 들어가고, 화면과 PDF 가 같습니다${tight ? ` (빠듯한 시트 ${tight}개 — 내용을 더 넣지 말 것)` : ""}.`);
