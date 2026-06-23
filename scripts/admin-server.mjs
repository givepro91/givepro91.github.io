#!/usr/bin/env node
// Keunsik Works — 로컬 전용 콘텐츠/이미지 관리 서버 (라이브에 절대 포함되지 않음)
// 실행: npm run admin  →  http://127.0.0.1:4400
// 관리 대상(전부 로컬 파일만 R/W):
//   · 포폴 Work 텍스트 = src/content/projects/ko/*.md frontmatter
//   · 이력서 CV 텍스트 = src/data/cv.json
//   · 제품 이미지       = src/data/galleries.json  (+ public/og 파일)
// 저장 후 배포:  git add public/og src/data/galleries.json src/data/cv.json src/content && git commit && git push

import { createServer } from "node:http";
import { readFile, writeFile, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const ROOT = process.cwd();
const OG_DIR = join(ROOT, "public", "og");
const GALLERIES = join(ROOT, "src", "data", "galleries.json");
const CV_JSON = join(ROOT, "src", "data", "cv.json");
const CONTENT_DIR = join(ROOT, "src", "content", "projects", "ko");
const ADMIN_HTML = join(ROOT, "scripts", "admin.html");
const PORT = 4400;
const HOST = "127.0.0.1";

const MIME = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".html": "text/html; charset=utf-8", ".json": "application/json",
};

function send(res, code, body, type = "application/json") {
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
}
const json = (res, obj, code = 200) => send(res, code, JSON.stringify(obj), "application/json");

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > 25 * 1024 * 1024) { reject(new Error("payload too large (>25MB)")); req.destroy(); return; }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function readJson(file, fallback) {
  try { return JSON.parse(await readFile(file, "utf8")); } catch { return fallback; }
}
const readGalleries = () => readJson(GALLERIES, { work: {}, cv: {} });

// --- frontmatter (md) ---
function splitFrontmatter(txt) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(txt);
  if (!m) return { data: {}, body: txt };
  return { data: yaml.load(m[1]) || {}, body: m[2] || "" };
}
function buildMd(data, body) {
  const y = yaml.dump(data, { lineWidth: -1, noRefs: true, quotingType: '"' });
  return `---\n${y}---\n${body && body.trim() ? "\n" + body.replace(/^\n+/, "") : ""}`;
}

async function listWork() {
  const files = (await readdir(CONTENT_DIR)).filter((f) => /\.mdx?$/.test(f));
  const out = [];
  for (const f of files) {
    const slug = f.replace(/\.mdx?$/, "");
    const { data } = splitFrontmatter(await readFile(join(CONTENT_DIR, f), "utf8"));
    out.push({
      key: slug, file: f, frontmatter: data,
      label: data.title || slug, kind: data.kind || "work",
      visibility: data.visibility || "anon", order: typeof data.order === "number" ? data.order : 999,
    });
  }
  out.sort((a, b) => a.order - b.order);
  return out;
}

function uniqueName(orig) {
  let base = basename(orig || "image").toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  let ext = extname(base);
  if (!MIME[ext]) ext = ".png";
  let stem = (ext ? base.slice(0, base.length - extname(base).length) : base) || "image";
  stem = stem.replace(/[.\-]+$/, "").replace(/^[.\-]+/, "") || "image";
  let name = `${stem}${ext}`;
  let i = 1;
  while (existsSync(join(OG_DIR, name))) { name = `${stem}-${i}${ext}`; i++; }
  return name;
}

function cleanGalleries(data) {
  const clean = { work: {}, cv: {} };
  for (const sec of ["work", "cv"]) {
    const src = (data && data[sec]) || {};
    for (const k of Object.keys(src)) {
      const arr = (Array.isArray(src[k]) ? src[k] : [])
        .filter((s) => typeof s === "string" && /^\/og\/[\w.-]+$/.test(s) && existsSync(join(ROOT, "public", s)));
      if (arr.length) clean[sec][k] = arr;
    }
  }
  return clean;
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${HOST}:${PORT}`);
    const path = decodeURIComponent(url.pathname);

    if (req.method === "GET" && (path === "/" || path === "/index.html")) {
      return send(res, 200, await readFile(ADMIN_HTML, "utf8"), MIME[".html"]);
    }

    // 전체 콘텐츠 + 이미지 상태
    if (req.method === "GET" && path === "/api/content") {
      const g = await readGalleries();
      const work = (await listWork()).map((w) => ({ ...w, shots: g.work[w.key] || [] }));
      const cv = await readJson(CV_JSON, {});
      return json(res, { work, cv, cvImages: g.cv || {} });
    }

    // 미리보기 iframe 용 사이트 CSS 서빙
    if (req.method === "GET" && path === "/global.css") {
      return send(res, 200, await readFile(join(ROOT, "src", "styles", "global.css"), "utf8"), "text/css");
    }

    // 미리보기용 이미지 서빙 (public/og 만)
    if (req.method === "GET" && path.startsWith("/og/")) {
      const file = join(OG_DIR, basename(path));
      if (!existsSync(file)) return send(res, 404, "not found", "text/plain");
      return send(res, 200, await readFile(file), MIME[extname(file).toLowerCase()] || "application/octet-stream");
    }

    if (req.method === "POST" && path === "/api/upload") {
      const { dataUrl, filename } = JSON.parse(await readBody(req));
      const m = /^data:(image\/[\w.+-]+);base64,(.+)$/s.exec(dataUrl || "");
      if (!m) return json(res, { error: "이미지 데이터가 아닙니다" }, 400);
      const buf = Buffer.from(m[2], "base64");
      if (buf.length > 20 * 1024 * 1024) return json(res, { error: "20MB 초과" }, 400);
      const name = uniqueName(filename);
      await writeFile(join(OG_DIR, name), buf);
      return json(res, { url: `/og/${name}`, bytes: buf.length });
    }

    // 이미지 갤러리 저장
    if (req.method === "POST" && path === "/api/save") {
      const data = JSON.parse(await readBody(req));
      const clean = cleanGalleries(data);
      await writeFile(GALLERIES, JSON.stringify(clean, null, 2) + "\n");
      return json(res, { ok: true });
    }

    // 포폴 Work frontmatter 저장 (본문 보존)
    if (req.method === "POST" && path === "/api/work") {
      const { slug, frontmatter } = JSON.parse(await readBody(req));
      if (typeof slug !== "string" || !/^[\w-]+$/.test(slug)) return json(res, { error: "잘못된 slug" }, 400);
      if (!frontmatter || typeof frontmatter !== "object") return json(res, { error: "frontmatter 없음" }, 400);
      if (!frontmatter.title) return json(res, { error: "title 은 필수입니다" }, 400);
      const file = join(CONTENT_DIR, slug + ".md");
      if (!existsSync(file)) return json(res, { error: "파일 없음: " + slug }, 404);
      const { body } = splitFrontmatter(await readFile(file, "utf8"));
      await writeFile(file, buildMd(frontmatter, body));
      return json(res, { ok: true });
    }

    // 이력서 CV 저장
    if (req.method === "POST" && path === "/api/cv") {
      const { cv } = JSON.parse(await readBody(req));
      if (!cv || typeof cv !== "object" || !cv.PROFILE) return json(res, { error: "cv 데이터 형식 오류" }, 400);
      await writeFile(CV_JSON, JSON.stringify(cv, null, 2) + "\n");
      return json(res, { ok: true });
    }

    // 미사용 이미지 파일 물리 삭제 (galleries 어디에도 없을 때만)
    if (req.method === "POST" && path === "/api/delete-file") {
      const { url: u } = JSON.parse(await readBody(req));
      if (typeof u !== "string" || !/^\/og\/[\w.-]+$/.test(u)) return json(res, { error: "잘못된 경로" }, 400);
      const g = cleanGalleries(await readGalleries());
      const used = new Set([...Object.values(g.work), ...Object.values(g.cv)].flat());
      if (used.has(u)) return json(res, { error: "아직 사용 중 — 먼저 저장 후 삭제" }, 409);
      const file = join(OG_DIR, basename(u));
      if (existsSync(file)) await unlink(file);
      return json(res, { ok: true });
    }

    return send(res, 404, "not found", "text/plain");
  } catch (e) {
    return json(res, { error: String((e && e.message) || e) }, 500);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`\n  Keunsik Works 콘텐츠·이미지 관리 (로컬 전용)\n  →  http://${HOST}:${PORT}\n`);
  console.log("  저장 후 배포:  git add public/og src/data src/content && git commit && git push\n");
});
