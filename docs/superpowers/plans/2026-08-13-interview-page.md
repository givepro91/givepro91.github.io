# /interview 암호화 면접 준비 페이지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 이력서 기반 면접 준비 문답(CS · 직무 적합도 · 조직 적합도)을 AES-256-GCM으로 봉인해 공개 사이트 `/interview`에 올리고, 비밀번호를 아는 브라우저에서만 복호화해 읽게 한다.

**Architecture:** 평문 원문은 gitignore된 `private/interview/*.md`에만 존재한다. 로컬에서 `pnpm interview:seal`을 돌리면 원문을 파싱해 JSON으로 만들고 비밀번호로 암호화해 `src/data/interview.sealed.json`을 만든다. 이 암호문만 커밋되고, Astro가 페이지에 인라인한다. 브라우저는 Web Crypto로 같은 파라미터를 써서 복호화한다.

**Tech Stack:** Astro 5 (정적 빌드), Node 26 내장 `node:crypto` · `node:test`, 브라우저 내장 `crypto.subtle`. 새 의존성 없음.

## Global Constraints

- 새 npm 의존성을 추가하지 않는다. Node 내장 모듈과 브라우저 내장 API만 쓴다.
- 평문 원문은 어떤 경우에도 git에 들어가지 않는다.
- 비밀번호는 어떤 파일·환경변수·CI 설정에도 저장하지 않는다.
- 봉인 JSON의 키 이름은 `v` · `kdf` · `salt` · `iter` · `hash` · `iv` · `ct` 만 쓴다. `password` · `secret` · `key` · `token` 을 키 이름으로 쓰면 `scripts/check-disclosure.mjs`의 자격증명 패턴에 걸려 빌드가 막힌다.
- 암호 파라미터: PBKDF2-HMAC-SHA256 / salt 16바이트 / 반복 310,000회 / 파생키 32바이트, AES-256-GCM / IV 12바이트 / 인증태그 16바이트, 저장은 `ciphertext || authTag`.
- 콘텐츠에 퇴직 사유 · 인사평가 · 연봉을 넣지 않는다.
- `pnpm build`(소스·dist 게이트 포함)가 통과해야 배포 가능하다. `build:nogate`로 우회하지 않는다.
- 스테이징은 명시 경로만. `git add .` / `git add -A` 금지.

## File Structure

| 파일 | 책임 |
|---|---|
| `scripts/lib/interview-crypto.mjs` | 봉인·해제 순수 함수. 파일 I/O 없음 |
| `scripts/lib/interview-content.mjs` | 마크다운 원문 → 콘텐츠 JSON 변환. 파일 I/O 없음 |
| `scripts/interview.test.mjs` | 위 두 모듈의 `node:test` 테스트 |
| `scripts/seal-interview.mjs` | CLI. 파일 읽기·git 추적 확인·비밀번호 입력·쓰기·자체 검증 |
| `private/interview/*.md` | 평문 원문 (gitignore) |
| `src/data/interview.sealed.json` | 생성된 암호문 (커밋 대상) |
| `src/pages/interview.astro` | 잠금 화면 + 해제 후 UI + 브라우저 복호화 |

---

### Task 1: 저장소 위생과 빌드 게이트 정합

원문이 커밋되거나 게이트에 스캔되지 않도록 먼저 막는다. 이게 없으면 이후 작업 중 실수로 원문이 추적될 수 있다.

**Files:**
- Modify: `.gitignore`
- Modify: `scripts/check-disclosure.mjs:50-53` (`SKIP_DIR`)
- Modify: `package.json` (scripts)

- [ ] **Step 1: `.gitignore`에 원문 경로 추가**

`# planning & prototype artifacts` 블록 아래에 추가:

```
# 면접 준비 원문 (평문) — 절대 커밋하지 않는다. 암호문만 src/data/interview.sealed.json 으로 커밋
private/
```

- [ ] **Step 2: 게이트 스캔 제외 디렉토리에 `private` 추가**

`scripts/check-disclosure.mjs`의 `SKIP_DIR`:

```js
const SKIP_DIR = new Set([
  ".git", "node_modules", ".astro", "dist", ".omc",
  ".playwright-mcp", ".nova", ".vscode", "private",
]);
```

- [ ] **Step 3: package.json 스크립트 추가**

`"admin"` 아래에 추가:

```json
"interview:seal": "node scripts/seal-interview.mjs",
"test:interview": "node --test scripts/interview.test.mjs"
```

- [ ] **Step 4: 게이트가 여전히 통과하는지 확인**

Run: `pnpm check:disclosure`
Expected: 실패 없이 종료

- [ ] **Step 5: 커밋**

```bash
git add .gitignore scripts/check-disclosure.mjs package.json
git commit -m "chore(interview): 원문 경로 gitignore + 게이트 스캔 제외 + seal 스크립트 등록"
```

---

### Task 2: 봉인·해제 암호 모듈

**Files:**
- Create: `scripts/lib/interview-crypto.mjs`
- Create: `scripts/interview.test.mjs`

**Interfaces:**
- Produces: `seal(plaintext: string, password: string) -> SealedBox`, `unseal(box: SealedBox, password: string) -> string`
- `SealedBox` = `{ v: 1, kdf: { name, hash, iter, salt }, iv, ct }` (salt·iv·ct는 base64 문자열)

- [ ] **Step 1: 실패하는 테스트 작성**

`scripts/interview.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { seal, unseal } from "./lib/interview-crypto.mjs";

const PW = "correct horse battery staple";

test("봉인한 내용을 같은 비밀번호로 풀면 원문과 같다", () => {
  const box = seal('{"sections":[]}', PW);
  assert.equal(unseal(box, PW), '{"sections":[]}');
});

test("한글도 왕복한다", () => {
  const src = "서킷브레이커는 요청을 멈추는 판단입니다";
  assert.equal(unseal(seal(src, PW), PW), src);
});

test("비밀번호가 틀리면 복호화가 실패한다", () => {
  const box = seal("secret text", PW);
  assert.throws(() => unseal(box, "wrong password"));
});

test("암호문이 한 글자라도 바뀌면 실패한다", () => {
  const box = seal("secret text", PW);
  const bytes = Buffer.from(box.ct, "base64");
  bytes[0] ^= 0xff;
  assert.throws(() => unseal({ ...box, ct: bytes.toString("base64") }, PW));
});

test("같은 내용을 두 번 봉인하면 salt·iv가 달라 암호문도 다르다", () => {
  assert.notEqual(seal("same", PW).ct, seal("same", PW).ct);
});

test("봉인 결과에 평문이 남지 않는다", () => {
  const box = seal("찾을수있는평문", PW);
  assert.ok(!JSON.stringify(box).includes("찾을수있는평문"));
});
```

- [ ] **Step 2: 실패 확인**

Run: `pnpm test:interview`
Expected: FAIL — `Cannot find module './lib/interview-crypto.mjs'`

- [ ] **Step 3: 구현**

`scripts/lib/interview-crypto.mjs`:

```js
// 면접 페이지 봉인·해제. 브라우저의 Web Crypto와 동일한 파라미터를 쓴다.
import { randomBytes, pbkdf2Sync, createCipheriv, createDecipheriv } from "node:crypto";

export const KDF = { name: "PBKDF2", hash: "SHA-256", iter: 310_000 };
const KEY_BYTES = 32;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const TAG_BYTES = 16;

function deriveKey(password, salt, iter) {
  return pbkdf2Sync(password, salt, iter, KEY_BYTES, "sha256");
}

export function seal(plaintext, password) {
  const salt = randomBytes(SALT_BYTES);
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", deriveKey(password, salt, KDF.iter), iv);
  const body = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return {
    v: 1,
    kdf: { ...KDF, salt: salt.toString("base64") },
    iv: iv.toString("base64"),
    ct: Buffer.concat([body, cipher.getAuthTag()]).toString("base64"),
  };
}

export function unseal(box, password) {
  const salt = Buffer.from(box.kdf.salt, "base64");
  const iv = Buffer.from(box.iv, "base64");
  const raw = Buffer.from(box.ct, "base64");
  const body = raw.subarray(0, raw.length - TAG_BYTES);
  const tag = raw.subarray(raw.length - TAG_BYTES);
  const decipher = createDecipheriv("aes-256-gcm", deriveKey(password, salt, box.kdf.iter), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(body), decipher.final()]).toString("utf8");
}
```

- [ ] **Step 4: 통과 확인**

Run: `pnpm test:interview`
Expected: 6 tests PASS

- [ ] **Step 5: 커밋**

```bash
git add scripts/lib/interview-crypto.mjs scripts/interview.test.mjs
git commit -m "feat(interview): AES-256-GCM 봉인·해제 모듈 + 왕복 테스트"
```

---

### Task 3: 마크다운 원문 파서

**Files:**
- Create: `scripts/lib/interview-content.mjs`
- Modify: `scripts/interview.test.mjs` (테스트 추가)

**Interfaces:**
- Consumes: 없음
- Produces: `buildContent(files: {id, raw}[]) -> { sections: [{ id, title, items: [{ q, a, tags }] }] }`
  - `id`는 파일명에서 숫자 접두사와 확장자를 뺀 값 (`10-cs.md` → `cs`)
  - `a`는 HTML 문자열, `tags`는 문자열 배열

- [ ] **Step 1: 실패하는 테스트 추가**

`scripts/interview.test.mjs` 끝에 추가:

```js
import { buildContent } from "./lib/interview-content.mjs";

const SAMPLE = `---
title: CS
---

## 서킷브레이커가 뭔가요?
tags: 안정성, realty

요청 자체를 멈추는 판단입니다.

- 꼬리질문: half-open은요?
- 배치라서 다음 실행이 재시도입니다

## 백오프는요?

간격을 늘려 재시도하는 것입니다.
`;

test("frontmatter 제목과 질문 목록을 뽑는다", () => {
  const { sections } = buildContent([{ id: "10-cs.md", raw: SAMPLE }]);
  assert.equal(sections.length, 1);
  assert.equal(sections[0].id, "cs");
  assert.equal(sections[0].title, "CS");
  assert.equal(sections[0].items.length, 2);
  assert.equal(sections[0].items[0].q, "서킷브레이커가 뭔가요?");
  assert.equal(sections[0].items[1].q, "백오프는요?");
});

test("tags 줄은 태그로 빠지고 본문에 남지 않는다", () => {
  const [s] = buildContent([{ id: "10-cs.md", raw: SAMPLE }]).sections;
  assert.deepEqual(s.items[0].tags, ["안정성", "realty"]);
  assert.ok(!s.items[0].a.includes("tags:"));
  assert.deepEqual(s.items[1].tags, []);
});

test("문단과 목록을 HTML로 바꾼다", () => {
  const [s] = buildContent([{ id: "10-cs.md", raw: SAMPLE }]).sections;
  assert.ok(s.items[0].a.includes("<p>요청 자체를 멈추는 판단입니다.</p>"));
  assert.ok(s.items[0].a.includes("<li>꼬리질문: half-open은요?</li>"));
});

test("HTML 특수문자를 이스케이프한다", () => {
  const raw = "---\ntitle: X\n---\n\n## q\n\n<script>alert(1)</script> & 5 < 6\n";
  const [s] = buildContent([{ id: "10-x.md", raw }]).sections;
  assert.ok(!s.items[0].a.includes("<script>"));
  assert.ok(s.items[0].a.includes("&lt;script&gt;"));
  assert.ok(s.items[0].a.includes("&amp;"));
});

test("굵게와 인라인 코드를 변환한다", () => {
  const raw = "---\ntitle: X\n---\n\n## q\n\n**중요**한 `crypto.subtle` 이야기\n";
  const [s] = buildContent([{ id: "10-x.md", raw }]).sections;
  assert.ok(s.items[0].a.includes("<strong>중요</strong>"));
  assert.ok(s.items[0].a.includes("<code>crypto.subtle</code>"));
});

test("파일 순서대로 섹션이 정렬된다", () => {
  const mk = (t) => `---\ntitle: ${t}\n---\n\n## q\n\nbody\n`;
  const { sections } = buildContent([
    { id: "30-org.md", raw: mk("조직") },
    { id: "10-cs.md", raw: mk("CS") },
  ]);
  assert.deepEqual(sections.map((s) => s.title), ["CS", "조직"]);
});
```

- [ ] **Step 2: 실패 확인**

Run: `pnpm test:interview`
Expected: FAIL — `Cannot find module './lib/interview-content.mjs'`

- [ ] **Step 3: 구현**

`scripts/lib/interview-content.mjs`:

```js
// private/interview/*.md → 콘텐츠 JSON. 파일 I/O 없이 문자열만 다룬다.

function escapeHtml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// 이스케이프 후에만 부른다.
function inline(s) {
  return s
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function mdToHtml(md) {
  const blocks = md.trim().split(/\n{2,}/);
  const out = [];
  for (const block of blocks) {
    const lines = block.split("\n").filter((l) => l.trim() !== "");
    if (lines.length === 0) continue;

    if (lines.every((l) => l.trimStart().startsWith("- "))) {
      const items = lines
        .map((l) => `<li>${inline(escapeHtml(l.trimStart().slice(2).trim()))}</li>`)
        .join("");
      out.push(`<ul>${items}</ul>`);
      continue;
    }
    if (lines[0].startsWith("### ")) {
      out.push(`<h4>${inline(escapeHtml(lines[0].slice(4).trim()))}</h4>`);
      const rest = lines.slice(1);
      if (rest.length) out.push(`<p>${inline(escapeHtml(rest.join(" ")))}</p>`);
      continue;
    }
    if (lines.every((l) => l.trimStart().startsWith("> "))) {
      const text = lines.map((l) => l.trimStart().slice(2)).join(" ");
      out.push(`<blockquote>${inline(escapeHtml(text))}</blockquote>`);
      continue;
    }
    out.push(`<p>${inline(escapeHtml(lines.join("\n"))).replaceAll("\n", "<br>")}</p>`);
  }
  return out.join("");
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return { title: null, body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { title: null, body: raw };
  const head = raw.slice(3, end);
  const match = head.match(/^\s*title:\s*(.+)$/m);
  return {
    title: match ? match[1].trim() : null,
    body: raw.slice(raw.indexOf("\n", end + 1) + 1),
  };
}

function parseItems(body) {
  const chunks = body.split(/^## /m).slice(1);
  return chunks.map((chunk) => {
    const nl = chunk.indexOf("\n");
    const q = (nl === -1 ? chunk : chunk.slice(0, nl)).trim();
    let rest = nl === -1 ? "" : chunk.slice(nl + 1);

    let tags = [];
    const tagMatch = rest.match(/^\s*tags:\s*(.+)$/m);
    if (tagMatch && rest.trimStart().startsWith("tags:")) {
      tags = tagMatch[1].split(",").map((t) => t.trim()).filter(Boolean);
      rest = rest.replace(tagMatch[0], "");
    }
    return { q, a: mdToHtml(rest), tags };
  });
}

export function buildContent(files) {
  const sections = [...files]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(({ id, raw }) => {
      const { title, body } = parseFrontmatter(raw);
      const slug = id.replace(/\.md$/, "").replace(/^\d+-/, "");
      return { id: slug, title: title ?? slug, items: parseItems(body) };
    });
  return { sections };
}
```

- [ ] **Step 4: 통과 확인**

Run: `pnpm test:interview`
Expected: 12 tests PASS

- [ ] **Step 5: 커밋**

```bash
git add scripts/lib/interview-content.mjs scripts/interview.test.mjs
git commit -m "feat(interview): 마크다운 원문 파서 + HTML 변환 테스트"
```

---

### Task 4: 봉인 CLI

**Files:**
- Create: `scripts/seal-interview.mjs`

**Interfaces:**
- Consumes: `seal`/`unseal` (Task 2), `buildContent` (Task 3)
- Produces: `src/data/interview.sealed.json`

- [ ] **Step 1: 구현**

`scripts/seal-interview.mjs`:

```js
#!/usr/bin/env node
// 면접 준비 원문을 봉인한다.  실행: pnpm interview:seal
//   private/interview/*.md  (평문, gitignore)
//     → src/data/interview.sealed.json  (암호문, 커밋 대상)
// 비밀번호는 실행할 때 입력받고 어디에도 저장하지 않는다.
import { readdir, readFile, writeFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { seal, unseal } from "./lib/interview-crypto.mjs";
import { buildContent } from "./lib/interview-content.mjs";

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, "private", "interview");
const OUT = join(ROOT, "src", "data", "interview.sealed.json");

function die(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

// 원문이 git에 추적 중이면 즉시 중단한다.
function assertNotTracked() {
  const tracked = execFileSync("git", ["ls-files", "private/"], { encoding: "utf8" }).trim();
  if (tracked) {
    die(`원문이 git에 추적되고 있습니다. 봉인을 중단합니다.\n추적 중인 파일:\n${tracked}\n\n해제: git rm --cached -r private/`);
  }
}

function askHidden(prompt) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const onData = (char) => {
      if (["\n", "\r", ""].includes(char.toString("utf8"))) {
        process.stdin.removeListener("data", onData);
      } else {
        process.stdout.write("[2K[200D" + prompt + "*".repeat(rl.line.length));
      }
    };
    process.stdin.on("data", onData);
    rl.question(prompt, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const main = async () => {
  if (!existsSync(SRC_DIR)) die(`원문 폴더가 없습니다: ${SRC_DIR}`);
  assertNotTracked();

  const names = (await readdir(SRC_DIR)).filter((n) => n.endsWith(".md")).sort();
  if (names.length === 0) die(`봉인할 원문이 없습니다: ${SRC_DIR}/*.md`);

  const files = await Promise.all(
    names.map(async (id) => ({ id, raw: await readFile(join(SRC_DIR, id), "utf8") })),
  );
  const content = buildContent(files);
  const counts = content.sections.map((s) => `${s.title} ${s.items.length}문항`).join(" · ");
  const total = content.sections.reduce((n, s) => n + s.items.length, 0);
  console.log(`\n원문 ${names.length}개 → ${counts} (합계 ${total}문항)\n`);

  const pw = await askHidden("비밀번호: ");
  if (pw.length < 8) die("비밀번호가 너무 짧습니다 (8자 이상).");
  const confirm = await askHidden("한 번 더:   ");
  if (pw !== confirm) die("두 번 입력한 비밀번호가 다릅니다.");

  const plaintext = JSON.stringify(content);
  const box = seal(plaintext, pw);
  await writeFile(OUT, JSON.stringify(box), "utf8");

  // 자체 검증 — 방금 쓴 파일을 다시 읽어 원문과 일치하는지 확인한다.
  try {
    const written = JSON.parse(await readFile(OUT, "utf8"));
    if (unseal(written, pw) !== plaintext) throw new Error("복호화 결과가 원문과 다릅니다");
  } catch (e) {
    await unlink(OUT).catch(() => {});
    die(`자체 검증 실패 — 출력 파일을 삭제했습니다: ${e.message}`);
  }

  console.log(`✓ 봉인 완료 → src/data/interview.sealed.json (${(JSON.stringify(box).length / 1024).toFixed(1)}KB)`);
  console.log("  배포: git add src/data/interview.sealed.json && git commit && git push\n");
};

main().catch((e) => die(e.message));
```

- [ ] **Step 2: 원문 없이 실행해 안전 장치 확인**

Run: `pnpm interview:seal`
Expected: `✗ 원문 폴더가 없습니다: .../private/interview` 로 종료 (exit 1)

- [ ] **Step 3: 커밋**

```bash
git add scripts/seal-interview.mjs
git commit -m "feat(interview): 봉인 CLI — git 추적 확인·비밀번호 입력·자체 검증"
```

---

### Task 5: 원문 콘텐츠 작성

**Files:**
- Create: `private/interview/10-cs.md`
- Create: `private/interview/20-role-fit.md`
- Create: `private/interview/30-org-fit.md`

근거는 `src/data/cv.json`, `src/content/projects/ko/*.md`, 그리고 이번 세션에서 실측한 `~/Develop/swk/realty-data` 코드다. 퇴직 사유·인사평가·연봉은 넣지 않는다.

- [ ] **Step 1: 근거 읽기**

Run: `cat src/data/cv.json` 및 `ls src/content/projects/ko/`
확인할 것: 이력서에 실제로 적힌 스택·성과 표현 (여기 없는 주장은 문항으로 만들지 않는다)

- [ ] **Step 2: `10-cs.md` 작성 — 이력서 스택 기준 CS**

`title: CS`. 이력서에 실제 등장하는 것만 다룬다: 코루틴과 동시성, 큐·비동기 처리, 캐시, PostgreSQL 인덱스·트랜잭션, HTTP 상태코드와 재시도, 멱등성, MSA 경계, 정적 배포. 각 문항은 "무엇인지 → 왜 그걸 썼는지 → 안 썼다면 뭐가 문제였는지" 순서로 답을 쓴다.

- [ ] **Step 3: `20-role-fit.md` 작성 — 프로젝트별 직무 적합도**

`title: 직무 적합도`. 프로젝트별로 묶는다: Realty(서킷브레이커·백오프·지터·동 단위 체크포인트·무손실의 정확한 범위·기여 경계), PlanReview, Landbook, Nova, MIRIVA. **기여 경계를 문항으로 명시한다** — 팀원 몫과 본인 몫을 구분해 말하는 스크립트를 포함한다.

- [ ] **Step 4: `30-org-fit.md` 작성 — 조직 적합도**

`title: 조직 적합도`. 일하는 방식과 판단 기준 중심: 왜 백엔드에서 출발해 AI 제품까지 가는가, 역할 경계를 어떻게 잡는가, 에이전트를 어떻게 쓰는가, 사실 검증을 어떻게 하는가, 갈등·실패 사례. 퇴직 사유는 넣지 않는다.

- [ ] **Step 5: 원문이 git에 안 잡히는지 확인**

Run: `git status --short && git ls-files private/`
Expected: `private/` 관련 출력이 전혀 없음

---

### Task 6: `/interview` 페이지

**Files:**
- Create: `src/pages/interview.astro`

**Interfaces:**
- Consumes: `src/data/interview.sealed.json` (Task 4 산출물)

- [ ] **Step 1: 페이지 작성**

`src/pages/interview.astro`. `BaseLayout`을 쓰지 않는다 (GA·OG·사이트맵이 딸려온다).

```astro
---
import "../styles/global.css";
import sealed from "../data/interview.sealed.json";
---

<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <title>비공개</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
  <body class="iv">
    <script type="application/json" id="sealed" set:html={JSON.stringify(sealed)} />

    <main class="iv-wrap">
      <section id="lock" class="iv-lock">
        <h1>비공개 문서</h1>
        <form id="lock-form">
          <input id="pw" type="password" placeholder="비밀번호" autocomplete="current-password" autofocus />
          <button id="unlock" type="submit">열기</button>
        </form>
        <p id="msg" class="iv-msg" role="status"></p>
      </section>

      <section id="doc" hidden>
        <header class="iv-head">
          <nav id="tabs" class="iv-tabs"></nav>
          <div class="iv-tools">
            <input id="q" type="search" placeholder="검색" />
            <button id="expand" type="button">모두 펼치기</button>
            <button id="lock-again" type="button">잠그기</button>
          </div>
        </header>
        <div id="list" class="iv-list"></div>
        <p id="empty" class="iv-msg" hidden>검색 결과가 없습니다.</p>
      </section>
    </main>

    <script>
      const box = JSON.parse(document.getElementById("sealed").textContent);
      const $ = (id) => document.getElementById(id);
      const KEY = "iv-pw";
      let content = null, active = 0, allOpen = false;

      const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

      async function open(password) {
        const enc = new TextEncoder();
        const material = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
        const key = await crypto.subtle.deriveKey(
          { name: "PBKDF2", salt: b64(box.kdf.salt), iterations: box.kdf.iter, hash: box.kdf.hash },
          material, { name: "AES-GCM", length: 256 }, false, ["decrypt"],
        );
        const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64(box.iv) }, key, b64(box.ct));
        return JSON.parse(new TextDecoder().decode(plain));
      }

      function renderTabs() {
        $("tabs").innerHTML = "";
        content.sections.forEach((s, i) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = `${s.title} (${s.items.length})`;
          b.className = i === active ? "on" : "";
          b.onclick = () => { active = i; renderTabs(); renderList(); };
          $("tabs").append(b);
        });
      }

      function renderList() {
        const term = $("q").value.trim().toLowerCase();
        const items = content.sections[active].items.filter((it) =>
          !term ||
          it.q.toLowerCase().includes(term) ||
          it.a.toLowerCase().includes(term) ||
          it.tags.some((t) => t.toLowerCase().includes(term)),
        );
        $("list").innerHTML = "";
        for (const it of items) {
          const d = document.createElement("details");
          d.open = allOpen || Boolean(term);
          const s = document.createElement("summary");
          s.textContent = it.q;
          const body = document.createElement("div");
          body.className = "iv-a";
          body.innerHTML = it.a;
          if (it.tags.length) {
            const tags = document.createElement("p");
            tags.className = "iv-tags";
            tags.textContent = it.tags.join(" · ");
            body.append(tags);
          }
          d.append(s, body);
          $("list").append(d);
        }
        $("empty").hidden = items.length > 0;
      }

      function show() {
        $("lock").hidden = true;
        $("doc").hidden = false;
        renderTabs();
        renderList();
      }

      async function attempt(password, { fromStorage = false } = {}) {
        $("unlock").disabled = true;
        $("msg").textContent = "여는 중…";
        try {
          content = await open(password);
          sessionStorage.setItem(KEY, password);
          $("msg").textContent = "";
          show();
        } catch {
          sessionStorage.removeItem(KEY);
          $("msg").textContent = fromStorage ? "" : "비밀번호가 틀렸습니다.";
          $("pw").value = "";
          $("pw").focus();
        } finally {
          $("unlock").disabled = false;
        }
      }

      if (!crypto?.subtle) {
        $("msg").textContent = "이 브라우저에서는 열 수 없습니다. 최신 브라우저에서 https로 접속하세요.";
      } else {
        $("lock-form").addEventListener("submit", (e) => { e.preventDefault(); attempt($("pw").value); });
        $("q").addEventListener("input", renderList);
        $("expand").addEventListener("click", () => {
          allOpen = !allOpen;
          $("expand").textContent = allOpen ? "모두 접기" : "모두 펼치기";
          renderList();
        });
        $("lock-again").addEventListener("click", () => {
          sessionStorage.removeItem(KEY);
          location.reload();
        });
        const saved = sessionStorage.getItem(KEY);
        if (saved) attempt(saved, { fromStorage: true });
      }
    </script>

    <style>
      /* 이 페이지 전용 — 전역 CSS 위에 얹는다 */
      .iv { max-width: 52rem; margin: 0 auto; padding: 2rem 1.25rem 6rem; }
      .iv-lock { max-width: 22rem; margin: 6rem auto; text-align: center; }
      .iv-lock form { display: flex; gap: .5rem; margin-top: 1.5rem; }
      .iv-lock input { flex: 1; padding: .6rem .75rem; }
      .iv-msg { margin-top: .75rem; font-size: .875rem; opacity: .75; min-height: 1.25rem; }
      .iv-head { position: sticky; top: 0; padding: .75rem 0; background: inherit; }
      .iv-tabs { display: flex; flex-wrap: wrap; gap: .5rem; }
      .iv-tabs button { padding: .4rem .8rem; cursor: pointer; }
      .iv-tabs button.on { font-weight: 600; text-decoration: underline; }
      .iv-tools { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .75rem; }
      .iv-tools input { flex: 1; min-width: 8rem; padding: .4rem .6rem; }
      .iv-list details { padding: .85rem 0; border-top: 1px solid currentColor; border-top-color: color-mix(in srgb, currentColor 15%, transparent); }
      .iv-list summary { cursor: pointer; font-weight: 600; line-height: 1.5; }
      .iv-a { padding-top: .75rem; line-height: 1.75; }
      .iv-a ul { padding-left: 1.25rem; list-style: disc; }
      .iv-tags { margin-top: .75rem; font-size: .8125rem; opacity: .6; }
      @media print { .iv-head { position: static; } .iv-list details { display: block; } }
    </style>
  </body>
</html>
```

- [ ] **Step 2: 개발 서버에서 확인**

Run: `pnpm dev` 후 `http://localhost:4321/interview`
확인: 잘못된 비밀번호는 거부, 올바른 비밀번호는 해제, 탭 전환·검색·모두 펼치기 동작

- [ ] **Step 3: 커밋**

```bash
git add src/pages/interview.astro
git commit -m "feat(interview): 잠금 화면 + 브라우저 복호화 페이지"
```

---

### Task 7: 사이트맵 제외와 노출 검증

**Files:**
- Modify: `astro.config.ts`

- [ ] **Step 1: 사이트맵에서 제외**

```ts
integrations: [mdx(), sitemap({ filter: (page) => !page.includes("/interview") })],
```

- [ ] **Step 2: 빌드**

Run: `pnpm build`
Expected: 소스·dist 게이트 모두 PASS

- [ ] **Step 3: 산출물에 평문이 없는지 확인**

Run:
```bash
grep -rl "서킷브레이커" dist/ | grep -v "realty" || echo "평문 없음"
grep -c "interview" dist/sitemap-0.xml || echo "사이트맵에 없음"
```
Expected: `/interview` 페이지 파일에서 원문 문구가 검출되지 않고, 사이트맵에 `interview` 없음

- [ ] **Step 4: 커밋**

```bash
git add astro.config.ts
git commit -m "chore(interview): 사이트맵에서 /interview 제외"
```

---

### Task 8: 봉인하고 배포

- [ ] **Step 1: 봉인**

Run: `pnpm interview:seal`
비밀번호를 두 번 입력한다. 자체 검증 통과 확인.

- [ ] **Step 2: 최종 빌드**

Run: `pnpm build`
Expected: 게이트 PASS

- [ ] **Step 3: 스테이징 대상 확인**

Run: `git status --short`
Expected: `private/` 관련 항목이 **없어야** 한다. 있으면 배포 중단.

- [ ] **Step 4: 커밋과 배포**

```bash
git add src/data/interview.sealed.json docs/superpowers
git commit -m "feat(interview): 면접 준비 문답 봉인본 추가"
git push origin main
```

- [ ] **Step 5: 배포 확인**

Run: `gh run list --limit 3`
Expected: 워크플로우 성공. 이후 `https://givepro91.github.io/interview` 접속해 잠금 화면 확인.

- [ ] **Step 6: 핸드오프 갱신**

`docs/handoff/main.md` 상단에 이번 작업 항목 추가 — 무엇을 만들었고, 재봉인 명령이 무엇이며, 비밀번호는 어디에도 저장돼 있지 않다는 사실.
