import "server-only";
import { createClient } from "@/lib/supabase/server";
import { MAX_ACTIVE_POPUPS, type PopupNotice } from "@/lib/popup-types";

/** 랜딩페이지 노출용 — 활성 + 노출기간 내인 팝업 최대 3개 */
export async function getActivePopups(): Promise<PopupNotice[]> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("popup_notices")
    .select("*")
    .eq("is_active", true)
    .lte("starts_at", nowIso)
    .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
    .order("sort_order", { ascending: true })
    .limit(MAX_ACTIVE_POPUPS);

  if (error) return [];
  return (data ?? []) as PopupNotice[];
}

/** 관리자 목록 — 비활성/기간 만료 포함 전체 */
export async function getAllPopups(): Promise<PopupNotice[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("popup_notices")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return [];
  return (data ?? []) as PopupNotice[];
}

export async function getPopup(id: string): Promise<PopupNotice | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("popup_notices")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as PopupNotice;
}

export async function countActivePopups(excludeId?: string): Promise<number> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  let query = supabase
    .from("popup_notices")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true)
    .lte("starts_at", nowIso)
    .or(`ends_at.is.null,ends_at.gte.${nowIso}`);

  if (excludeId) query = query.neq("id", excludeId);

  const { count } = await query;
  return count ?? 0;
}
