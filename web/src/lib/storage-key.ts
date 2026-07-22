/**
 * Supabase Storage object keys only accept a restricted ASCII charset.
 * Uploaded file names routinely contain Korean text, spaces, and punctuation
 * (e.g. "26-29 2026년 제34회 대한작업치료학회 학술대회 개최 안내.pdf"), which Storage
 * rejects with "Invalid key". This strips the name down to a safe key while the
 * original name is kept separately (e.g. `post_attachments.file_name`) for display.
 */
export function safeStorageFileName(originalName: string): string {
  const lastDot = originalName.lastIndexOf(".");
  const hasExt = lastDot > 0 && lastDot < originalName.length - 1;
  const base = hasExt ? originalName.slice(0, lastDot) : originalName;
  const ext = hasExt ? originalName.slice(lastDot + 1) : "";

  const safeBase = base
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  const safeExt = ext.replace(/[^a-zA-Z0-9]/g, "");
  const finalBase = safeBase || "file";
  return safeExt ? `${finalBase}.${safeExt}` : finalBase;
}
