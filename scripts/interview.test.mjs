// 면접 페이지 봉인·파싱 테스트.  실행: pnpm test:interview
import { test } from "node:test";
import assert from "node:assert/strict";
import { seal, unseal } from "./lib/interview-crypto.mjs";
import { buildContent } from "./lib/interview-content.mjs";

const PW = "correct horse battery staple";

// ── 봉인·해제 ───────────────────────────────────────────────

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

test("암호문이 한 바이트라도 바뀌면 실패한다", () => {
  const box = seal("secret text", PW);
  const bytes = Buffer.from(box.ct, "base64");
  bytes[0] ^= 0xff;
  assert.throws(() => unseal({ ...box, ct: bytes.toString("base64") }, PW));
});

test("같은 내용을 두 번 봉인하면 암호문이 다르다", () => {
  assert.notEqual(seal("same", PW).ct, seal("same", PW).ct);
});

test("봉인 결과에 평문이 남지 않는다", () => {
  const box = seal("찾을수있는평문", PW);
  assert.ok(!JSON.stringify(box).includes("찾을수있는평문"));
});

test("봉인 결과에 게이트가 막는 키 이름이 없다", () => {
  const keys = JSON.stringify(seal("x", PW));
  for (const banned of ["password", "secret", "token", '"key"']) {
    assert.ok(!keys.includes(banned), `금지된 키 이름: ${banned}`);
  }
});

// ── 원문 파싱 ───────────────────────────────────────────────

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

test("소제목과 인용을 변환한다", () => {
  const raw = "---\ntitle: X\n---\n\n## q\n\n### 꼬리질문\n\n> 그대로 말해도 되는 문장\n";
  const [s] = buildContent([{ id: "10-x.md", raw }]).sections;
  assert.ok(s.items[0].a.includes("<h4>꼬리질문</h4>"));
  assert.ok(s.items[0].a.includes("<blockquote>그대로 말해도 되는 문장</blockquote>"));
});

test("소제목 바로 아래 목록도 목록으로 남는다 (빈 줄 없음)", () => {
  const raw = "---\ntitle: X\n---\n\n## q\n\n### 꼬리질문\n- 첫째 질문 → 답\n- 둘째 질문 → 답\n";
  const [s] = buildContent([{ id: "10-x.md", raw }]).sections;
  const a = s.items[0].a;
  assert.ok(a.includes("<h4>꼬리질문</h4>"));
  assert.ok(a.includes("<li>첫째 질문 → 답</li>"), "목록 항목이 li 로 남아야 한다");
  assert.ok(a.includes("<li>둘째 질문 → 답</li>"));
  assert.ok(!a.includes("<p>- "), "목록이 문단으로 뭉개지면 안 된다");
});

test("도식(코드 블록)은 원문 그대로 pre 로 보존된다", () => {
  const raw =
    "---\ntitle: X\n---\n\n## q\n\n앞 문단.\n\n```\n회사\n └ 조직\n\n    └ 사용자\n```\n\n뒤 문단.\n";
  const [s] = buildContent([{ id: "10-x.md", raw }]).sections;
  const a = s.items[0].a;
  assert.ok(a.includes("<pre><code>"), "pre 로 감싸야 한다");
  assert.ok(a.includes(" └ 조직"), "들여쓰기가 보존돼야 한다");
  assert.ok(a.includes("\n\n    └ 사용자"), "도식 안의 빈 줄도 유지돼야 한다");
  assert.ok(a.includes("<p>앞 문단.</p>") && a.includes("<p>뒤 문단.</p>"));
  assert.ok(!a.includes("```"), "fence 표시가 남으면 안 된다");
});

test("도식 안의 꺾쇠는 이스케이프된다", () => {
  const raw = "---\ntitle: X\n---\n\n## q\n\n```\nA -> B <조건>\n```\n";
  const [s] = buildContent([{ id: "10-x.md", raw }]).sections;
  assert.ok(s.items[0].a.includes("&lt;조건&gt;"));
});

test("파일명 순서대로 섹션이 정렬된다", () => {
  const mk = (t) => `---\ntitle: ${t}\n---\n\n## q\n\nbody\n`;
  const { sections } = buildContent([
    { id: "30-org.md", raw: mk("조직") },
    { id: "10-cs.md", raw: mk("CS") },
  ]);
  assert.deepEqual(sections.map((s) => s.title), ["CS", "조직"]);
});

// ── 통합 ───────────────────────────────────────────────────

test("파싱한 콘텐츠를 봉인하면 질문 문구가 노출되지 않는다", () => {
  const content = buildContent([{ id: "10-cs.md", raw: SAMPLE }]);
  const box = seal(JSON.stringify(content), PW);
  assert.ok(!JSON.stringify(box).includes("서킷브레이커"));
  assert.deepEqual(JSON.parse(unseal(box, PW)), content);
});
