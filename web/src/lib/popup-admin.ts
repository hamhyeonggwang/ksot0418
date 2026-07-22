"use client";

import { createClient } from "@/lib/supabase/client";
import type { PopupMediaType } from "@/lib/popup-types";
import { safeStorageFileName } from "@/lib/storage-key";

export type PopupInput = {
  title: string;
  link_url: string | null;
  starts_at: string;
  ends_at: string | null;
  sort_order: number;
  is_active: boolean;
};

function mediaTypeFor(file: File): PopupMediaType {
  return file.type === "application/pdf" ? "pdf" : "image";
}

export async function createPopup(input: PopupInput, file: File) {
  const supabase = createClient();
  const path = `${crypto.randomUUID()}-${safeStorageFileName(file.name)}`;

  const { error: uploadErr } = await supabase.storage.from("popup").upload(path, file);
  if (uploadErr) return { data: null, error: uploadErr.message };

  const { data, error } = await supabase
    .from("popup_notices")
    .insert({ ...input, media_type: mediaTypeFor(file), storage_path: path })
    .select()
    .single();

  if (error) {
    await supabase.storage.from("popup").remove([path]);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updatePopup(
  id: string,
  input: PopupInput,
  newFile?: File,
  prevStoragePath?: string
) {
  const supabase = createClient();

  let storagePath = prevStoragePath;
  let mediaType: PopupMediaType | undefined;

  if (newFile) {
    const path = `${crypto.randomUUID()}-${safeStorageFileName(newFile.name)}`;
    const { error: uploadErr } = await supabase.storage.from("popup").upload(path, newFile);
    if (uploadErr) return { error: uploadErr.message };

    if (prevStoragePath) {
      await supabase.storage.from("popup").remove([prevStoragePath]);
    }
    storagePath = path;
    mediaType = mediaTypeFor(newFile);
  }

  const { error } = await supabase
    .from("popup_notices")
    .update({
      ...input,
      ...(storagePath ? { storage_path: storagePath } : {}),
      ...(mediaType ? { media_type: mediaType } : {}),
    })
    .eq("id", id);

  return { error: error?.message ?? null };
}

export async function deletePopup(id: string, storagePath: string) {
  const supabase = createClient();
  await supabase.storage.from("popup").remove([storagePath]);
  const { error } = await supabase.from("popup_notices").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function countActivePopupsClient(excludeId?: string): Promise<number> {
  const supabase = createClient();
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
