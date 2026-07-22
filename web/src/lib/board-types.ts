/** 게시판 타입 + 순수 헬퍼 — 클라이언트/서버 공용 */

export type BoardSlug = "notice" | "resources" | "education" | "conference" | "gallery";

export const BOARD_SLUGS: BoardSlug[] = [
  "notice",
  "resources",
  "education",
  "conference",
  "gallery",
];

export const BOARD_LABELS: Record<BoardSlug, string> = {
  notice: "공지사항",
  resources: "자료실",
  education: "보수교육 일정",
  conference: "학술대회 공지",
  gallery: "학회 갤러리",
};

export function isBoardSlug(value: string): value is BoardSlug {
  return (BOARD_SLUGS as string[]).includes(value);
}

export type Post = {
  id: string;
  board: BoardSlug;
  title: string;
  body: string;
  is_pinned: boolean;
  is_published: boolean;
  event_date: string | null;
  place: string | null;
  credits: string | null;
  view_count: number;
  author_id: string | null;
  created_at: string;
  updated_at: string;
};

export type PostAttachment = {
  id: string;
  post_id: string;
  file_name: string;
  storage_path: string;
  size_bytes: number | null;
  created_at: string;
};

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"];

export function isImageFile(fileName: string): boolean {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return !!ext && IMAGE_EXTENSIONS.includes(ext);
}

export function attachmentUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "#";
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/board/${path}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
