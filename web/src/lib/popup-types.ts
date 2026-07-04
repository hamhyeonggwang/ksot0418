/** 팝업 공지 타입 + 순수 헬퍼 — 클라이언트/서버 공용 */

export type PopupMediaType = "image" | "pdf";

export type PopupNotice = {
  id: string;
  title: string;
  media_type: PopupMediaType;
  storage_path: string;
  link_url: string | null;
  starts_at: string;
  ends_at: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export const MAX_ACTIVE_POPUPS = 3;

export function popupAssetUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "#";
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/popup/${path}`;
}
