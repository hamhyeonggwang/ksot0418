/**
 * files/journal/ 아래 PDF를 Supabase Storage bucket `journal`에 업로드합니다.
 *
 * 사전 준비:
 * 1. supabase/schema.sql, seed.sql 실행
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

function collectPdfs(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const ent of entries) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      files.push(...collectPdfs(full, rel));
    } else if (ent.name.toLowerCase().endsWith('.pdf')) {
      files.push({ rel, full });
    }
  }
  return files;
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

  const pdfs = collectPdfs(JOURNAL_DIR);
  if (!pdfs.length) {
    console.error('업로드할 PDF가 없습니다.');
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
