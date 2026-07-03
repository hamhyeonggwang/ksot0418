"use client";

import { createClient } from "@/lib/supabase/client";
import type { BoardSlug } from "@/lib/board-types";

export type PostInput = {
  board: BoardSlug;
  title: string;
  body: string;
  is_pinned: boolean;
  is_published: boolean;
  event_date: string | null;
  place: string | null;
  credits: string | null;
};

export async function createPost(input: PostInput) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...input, author_id: user?.id ?? null })
    .select()
    .single();

  return { data, error: error?.message ?? null };
}

export async function updatePost(id: string, input: PostInput) {
  const supabase = createClient();
  const { error } = await supabase.from("posts").update(input).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deletePost(id: string) {
  const supabase = createClient();

  const { data: attachments } = await supabase
    .from("post_attachments")
    .select("storage_path")
    .eq("post_id", id);

  if (attachments && attachments.length > 0) {
    await supabase.storage.from("board").remove(attachments.map((a) => a.storage_path));
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function uploadAttachment(postId: string, file: File) {
  const supabase = createClient();
  const path = `${postId}/${Date.now()}-${file.name}`;

  const { error: uploadErr } = await supabase.storage.from("board").upload(path, file);
  if (uploadErr) return { error: uploadErr.message };

  const { error } = await supabase.from("post_attachments").insert({
    post_id: postId,
    file_name: file.name,
    storage_path: path,
    size_bytes: file.size,
  });

  return { error: error?.message ?? null };
}

export async function deleteAttachment(attachmentId: string, storagePath: string) {
  const supabase = createClient();
  await supabase.storage.from("board").remove([storagePath]);
  const { error } = await supabase.from("post_attachments").delete().eq("id", attachmentId);
  return { error: error?.message ?? null };
}
