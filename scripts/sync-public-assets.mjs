/**
 * 정적 사이트(pages, css, js, images, files) → web/public 동기화
 * Next.js 메인 배포 시 /pages/*.html 등 기존 링크 유지
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "web", "public");

const COPY_DIRS = ["pages", "css", "js", "images", "files"];

function rmrf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

function patchHtmlHomeLinks(filePath) {
  let html = fs.readFileSync(filePath, "utf8");
  html = html.replaceAll('href="../index.html"', 'href="/"');
  html = html.replaceAll("href='../index.html'", "href='/'");
  fs.writeFileSync(filePath, html, "utf8");
}

function walkHtml(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walkHtml(p);
    else if (name.endsWith(".html")) patchHtmlHomeLinks(p);
  }
}

function main() {
  console.log("Syncing static assets → web/public …");

  for (const dir of COPY_DIRS) {
    const src = path.join(ROOT, dir);
    const dest = path.join(PUBLIC, dir);
    if (!fs.existsSync(src)) {
      const msg = `  missing: ${dir} (expected at ${src})`;
      if (process.env.VERCEL || process.env.CI) {
        console.error(msg);
        console.error(
          "  → Vercel: Settings → General → Include source files outside of the Root Directory → ON"
        );
        process.exit(1);
      }
      console.warn(`  skip${msg}`);
      continue;
    }
    rmrf(dest);
    copyDir(src, dest);
    console.log(`  ✓ ${dir}/`);
  }

  const pagesDir = path.join(PUBLIC, "pages");
  if (fs.existsSync(pagesDir)) walkHtml(pagesDir);

  console.log("Done. Next.js serves /pages/*, /css/*, /js/* from public/");
}

main();
