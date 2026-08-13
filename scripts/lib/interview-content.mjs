// private/interview/*.md → 콘텐츠 JSON.
// 파일 I/O 없이 문자열만 다룬다(테스트 가능하도록).
//
// 원문 규칙:
//   - frontmatter 의 title 이 섹션 이름
//   - `## ` 로 시작하는 줄이 질문, 다음 `## ` 전까지가 답
//   - 답의 첫 줄이 `tags:` 면 쉼표로 끊어 태그로 쓰고 본문에서 뺀다

function escapeHtml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// 반드시 escapeHtml 이후에만 부른다.
function inline(s) {
  return s
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function mdToHtml(md) {
  const out = [];

  for (const block of md.trim().split(/\n{2,}/)) {
    const lines = block.split("\n").filter((l) => l.trim() !== "");
    if (lines.length === 0) continue;

    if (lines.every((l) => l.trimStart().startsWith("- "))) {
      const items = lines
        .map((l) => `<li>${inline(escapeHtml(l.trimStart().slice(2).trim()))}</li>`)
        .join("");
      out.push(`<ul>${items}</ul>`);
      continue;
    }

    if (lines.every((l) => l.trimStart().startsWith("> "))) {
      const text = lines.map((l) => l.trimStart().slice(2).trim()).join(" ");
      out.push(`<blockquote>${inline(escapeHtml(text))}</blockquote>`);
      continue;
    }

    if (lines[0].startsWith("### ")) {
      out.push(`<h4>${inline(escapeHtml(lines[0].slice(4).trim()))}</h4>`);
      const rest = lines.slice(1);
      if (rest.length) out.push(`<p>${inline(escapeHtml(rest.join(" ")))}</p>`);
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
  const afterFence = raw.indexOf("\n", end + 1);

  return {
    title: match ? match[1].trim() : null,
    body: afterFence === -1 ? "" : raw.slice(afterFence + 1),
  };
}

function parseItems(body) {
  return body
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const nl = chunk.indexOf("\n");
      const q = (nl === -1 ? chunk : chunk.slice(0, nl)).trim();
      let rest = nl === -1 ? "" : chunk.slice(nl + 1);

      let tags = [];
      if (rest.trimStart().startsWith("tags:")) {
        const match = rest.match(/^\s*tags:\s*(.+)$/m);
        if (match) {
          tags = match[1].split(",").map((t) => t.trim()).filter(Boolean);
          rest = rest.replace(match[0], "");
        }
      }

      return { q, a: mdToHtml(rest), tags };
    });
}

/** [{ id: "10-cs.md", raw }] → { sections: [{ id, title, items }] } */
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
