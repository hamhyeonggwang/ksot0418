"use client";

import { createClient } from "@/lib/supabase/client";
import { safeStorageFileName } from "@/lib/storage-key";

export type IssueInput = {
  volume: number;
  issue: number;
  year: number;
  month: number | null;
  label: string;
  published_label: string | null;
  article_count: number;
  sort_order: number;
};

export async function createIssue(input: IssueInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("journal_issues")
    .insert(input)
    .select()
    .single();
  return { data, error: error?.message ?? null };
}

export async function updateIssue(id: string, input: IssueInput) {
  const supabase = createClient();
  const { error } = await supabase.from("journal_issues").update(input).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteIssue(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("journal_issues").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export type ArticleInput = {
  issue_id: string;
  article_num: number;
  category: string;
  category_variant: "primary" | "teal";
  title: string;
  authors: string;
  pages: string | null;
  doi: string | null;
  pdf_storage_path: string;
  keywords: string[];
  abstract: string | null;
  sort_order: number;
};

export async function createArticle(input: ArticleInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("journal_articles")
    .insert(input)
    .select()
    .single();
  return { data, error: error?.message ?? null };
}

export async function updateArticle(id: string, input: ArticleInput) {
  const supabase = createClient();
  const { error } = await supabase.from("journal_articles").update(input).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteArticle(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("journal_articles").delete().eq("id", id);
  return { error: error?.message ?? null };
}

/** PDF를 journal 버킷 `{folder}/{timestamp}-{filename}` 경로에 업로드하고 storage_path를 반환 */
export async function uploadJournalPdf(folder: string, file: File) {
  const supabase = createClient();
  const path = `${folder}/${Date.now()}-${safeStorageFileName(file.name)}`;
  const { error } = await supabase.storage.from("journal").upload(path, file);
  if (error) return { path: null as string | null, error: error.message };
  return { path, error: null as string | null };
}
