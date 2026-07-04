/**
 * files/journal/KJOT-v{volume}n{issue}-{startPage}.pdf 를 Supabase Storage bucket `journal`에 업로드합니다.
 * 호(volume, issue) 안에서 시작 페이지 순으로 정렬해 `{volume}-{issue}/{01,02,...}.pdf` 경로로 저장합니다.
 * 이 경로 규칙은 supabase/seed.sql의 pdf_storage_path와 일치해야 합니다.
 *
 * 사전 준비:
 * 1. supabase/schema.sql, seed.sql, board_schema.sql, popup_schema.sql 실행
 * 2. Storage에서 Public bucket `journal` 생성
 * 3. .env 에 SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 설정
 *
 * 실행: npm install && npm run upload:journal
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const JOURNAL_DIR = path.join(ROOT, 'files', 'journal');
const BUCKET = 'journal';

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 가 .env 에 필요합니다.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const FILENAME_RE = /^KJOT-v(\d+)n(\d+)-(\d+)\.pdf$/i;

function collectAndMapPdfs(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const parsed = [];
  for (const ent of entries) {
    if (!ent.isFile()) continue;
    const m = ent.name.match(FILENAME_RE);
    if (!m) continue;
    parsed.push({
      file: ent.name,
      full: path.join(dir, ent.name),
      volume: Number(m[1]),
      issue: Number(m[2]),
      startPage: Number(m[3]),
    });
  }

  const byIssue = new Map();
  for (const p of parsed) {
    const key = `${p.volume}-${p.issue}`;
    if (!byIssue.has(key)) byIssue.set(key, []);
    byIssue.get(key).push(p);
  }

  const mapped = [];
  for (const [, arts] of byIssue) {
    arts.sort((a, b) => a.startPage - b.startPage);
    arts.forEach((a, idx) => {
      mapped.push({
        rel: `${a.volume}-${a.issue}/${String(idx + 1).padStart(2, '0')}.pdf`,
        full: a.full,
      });
    });
  }
  return mapped;
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.some((b) => b.name === BUCKET)) return;
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
  if (error) throw new Error(`bucket 생성 실패: ${error.message}`);
  console.log(`Storage bucket "${BUCKET}" 생성 (public)`);
}

async function uploadFile(rel, fullPath) {
  const body = fs.readFileSync(fullPath);
  const { error } = await supabase.storage.from(BUCKET).upload(rel, body, {
    contentType: 'application/pdf',
    upsert: true,
  });
  if (error) throw new Error(`${rel}: ${error.message}`);
  console.log(`  ✓ ${rel}`);
}

async function main() {
  if (!fs.existsSync(JOURNAL_DIR)) {
    console.error(`폴더 없음: ${JOURNAL_DIR}`);
    process.exit(1);
  }

  const pdfs = collectAndMapPdfs(JOURNAL_DIR);
  if (!pdfs.length) {
    console.error('업로드할 PDF가 없습니다. (파일명 형식: KJOT-v{권}n{호}-{시작페이지}.pdf)');
    process.exit(1);
  }

  console.log(`Supabase: ${url}`);
  console.log(`로컬: ${JOURNAL_DIR}`);
  console.log(`파일 ${pdfs.length}개 업로드 시작…\n`);

  await ensureBucket();

  for (const { rel, full } of pdfs) {
    await uploadFile(rel, full);
  }

  console.log('\n완료. 공개 URL 예시:');
  const sample = pdfs[0].rel;
  console.log(`  ${url}/storage/v1/object/public/${BUCKET}/${sample}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
