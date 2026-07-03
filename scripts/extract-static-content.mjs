/**
 * 정적 HTML pages/*.html → Next.js 콘텐츠 모듈 추출
 * <main class="page-content"> 내부 HTML + 페이지별 <style> 블록
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PAGES_DIR = path.join(ROOT, "pages");
const OUT_DIR = path.join(ROOT, "web", "src", "content", "static-pages");

const LINK_MAP = [
  ["../index.html", "/"],
  ["journal.html", "/journal"],
  ["about.html", "/about"],
  ["submission.html", "/submission"],
  ["education.html", "/education"],
  ["community.html", "/community"],
  ["guide.html", "/guide"],
  ["member.html", "/member"],
  ["terms.html", "/guide"],
  ["notice.html", "/board/notice"],
  ["conference.html", "https://ksot0919.vercel.app/index.html"],
];

const PAGE_FILES = [
  "about",
  "submission",
  "education",
  "community",
  "guide",
  "member",
];

function transformLinks(html) {
  let out = html;
  for (const [from, to] of LINK_MAP) {
    out = out.replaceAll(`href="${from}`, `href="${to}`);
    out = out.replaceAll(`href='${from}`, `href='${to}`);
  }
  // community.html#notice → /board/notice
  out = out.replaceAll('href="community.html#notice"', 'href="/board/notice"');
  out = out.replaceAll("href='community.html#notice'", "href='/board/notice'");
  return out;
}

function extractMainContent(html) {
  const start = html.indexOf('<main class="page-content">');
  if (start === -1) throw new Error("main.page-content not found");
  const contentStart = start + '<main class="page-content">'.length;
  const end = html.indexOf("</main>", contentStart);
  if (end === -1) throw new Error("</main> not found");
  return html.slice(contentStart, end).trim();
}

function extractInlineStyles(html) {
  const styles = [];
  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    styles.push(m[1].trim());
  }
  return styles.join("\n\n");
}

function escapeForTemplateLiteral(str) {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function writeContentModule(slug, html, extraCss) {
  const escapedHtml = escapeForTemplateLiteral(html);
  const escapedCss = escapeForTemplateLiteral(extraCss);
  const body = `/** Auto-generated from pages/${slug}.html — do not edit manually */
export const html = \`${escapedHtml}\`;
export const extraCss = \`${escapedCss}\`;
`;
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.ts`), body, "utf8");
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const slug of PAGE_FILES) {
    const filePath = path.join(PAGES_DIR, `${slug}.html`);
    if (!fs.existsSync(filePath)) {
      console.warn(`  skip: ${slug}.html not found`);
      continue;
    }
    const raw = fs.readFileSync(filePath, "utf8");
    const content = transformLinks(extractMainContent(raw));
    const extraCss = slug === "member" ? extractInlineStyles(raw) : "";
    writeContentModule(slug, content, extraCss);
    console.log(`  ✓ ${slug}.ts (${content.length} chars)`);
  }

  console.log(`Done → ${OUT_DIR}`);
}

main();
