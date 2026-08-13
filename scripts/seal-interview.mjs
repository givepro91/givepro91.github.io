#!/usr/bin/env node
// 면접 준비 원문을 봉인한다.
//
//   실행:  pnpm interview:seal            (비밀번호를 화면에 안 보이게 두 번 입력)
//          pnpm interview:seal --stdin    (비대화형 — 첫 줄을 비밀번호로 읽음)
//
//   private/interview/*.md            평문, gitignore, 커밋되지 않음
//     → src/data/interview.sealed.json 암호문, 커밋 대상
//
// 비밀번호는 어느 파일에도 저장하지 않는다.
import { readdir, readFile, writeFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createInterface } from "node:readline";
import { Writable } from "node:stream";
import { join } from "node:path";

import { seal, unseal } from "./lib/interview-crypto.mjs";
import { buildContent } from "./lib/interview-content.mjs";

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, "private", "interview");
const OUT = join(ROOT, "src", "data", "interview.sealed.json");
const USE_STDIN = process.argv.includes("--stdin");

function die(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

// 원문이 git 에 추적되고 있으면 즉시 중단한다 — 평문이 공개 레포로 나가는 것을 막는 마지막 방어선.
function assertNotTracked() {
  let tracked = "";
  try {
    tracked = execFileSync("git", ["ls-files", "private/"], { encoding: "utf8" }).trim();
  } catch {
    return; // git 저장소가 아니면 확인할 것이 없다
  }
  if (tracked) {
    die(
      `원문이 git 에 추적되고 있습니다. 봉인을 중단합니다.\n` +
        `추적 중:\n${tracked}\n\n해제: git rm --cached -r private/`,
    );
  }
}

function askHidden(prompt) {
  return new Promise((resolve) => {
    const muted = new Writable({
      write(chunk, enc, cb) {
        if (!muted.hidden) process.stdout.write(chunk, enc);
        cb();
      },
    });
    const rl = createInterface({ input: process.stdin, output: muted, terminal: true });
    rl.question(prompt, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
    muted.hidden = true; // question() 이 프롬프트를 쓴 직후부터 입력을 가린다
  });
}

function readStdin() {
  return new Promise((resolve) => {
    let buf = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (d) => (buf += d));
    process.stdin.on("end", () => resolve(buf.split("\n")[0].trim()));
  });
}

async function getPassword() {
  if (USE_STDIN) {
    const pw = await readStdin();
    if (!pw) die("stdin 에서 비밀번호를 읽지 못했습니다.");
    return pw;
  }
  if (!process.stdin.isTTY) {
    die("대화형 입력이 불가능합니다. 비대화형으로 봉인하려면 --stdin 을 쓰세요.");
  }
  const pw = await askHidden("비밀번호:   ");
  if (pw.length < 8) die("비밀번호가 너무 짧습니다 (8자 이상).");
  const again = await askHidden("한 번 더:   ");
  if (pw !== again) die("두 번 입력한 비밀번호가 다릅니다.");
  return pw;
}

async function main() {
  if (!existsSync(SRC_DIR)) die(`원문 폴더가 없습니다: ${SRC_DIR}`);
  assertNotTracked();

  const names = (await readdir(SRC_DIR)).filter((n) => n.endsWith(".md")).sort();
  if (names.length === 0) die(`봉인할 원문이 없습니다: ${SRC_DIR}/*.md`);

  const files = await Promise.all(
    names.map(async (id) => ({ id, raw: await readFile(join(SRC_DIR, id), "utf8") })),
  );

  const content = buildContent(files);
  const total = content.sections.reduce((n, s) => n + s.items.length, 0);
  if (total === 0) die("파싱된 문항이 0개입니다. 원문에 `## 질문` 줄이 있는지 확인하세요.");

  console.log(
    `\n원문 ${names.length}개 → ` +
      content.sections.map((s) => `${s.title} ${s.items.length}문항`).join(" · ") +
      ` (합계 ${total}문항)\n`,
  );

  const password = await getPassword();
  const plaintext = JSON.stringify(content);
  const box = seal(plaintext, password);
  await writeFile(OUT, JSON.stringify(box), "utf8");

  // 자체 검증 — 방금 쓴 파일을 다시 읽어 원문과 일치하는지 확인한다.
  try {
    const written = JSON.parse(await readFile(OUT, "utf8"));
    if (unseal(written, password) !== plaintext) {
      throw new Error("복호화 결과가 원문과 다릅니다");
    }
  } catch (e) {
    await unlink(OUT).catch(() => {});
    die(`자체 검증 실패 — 출력 파일을 지웠습니다: ${e.message}`);
  }

  const kb = (JSON.stringify(box).length / 1024).toFixed(1);
  console.log(`✓ 봉인 완료 → src/data/interview.sealed.json (${kb}KB)`);
  console.log(`  배포: git add src/data/interview.sealed.json && git commit && git push\n`);
}

main().catch((e) => die(e.message));
