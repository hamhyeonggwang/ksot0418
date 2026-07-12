import "server-only";
import { createClient } from "@/lib/supabase/server";
import { formatDate, type BoardSlug, type Post, type PostAttachment } from "@/lib/board-types";

const PAGE_SIZE = 20;

export async function getPosts(
  board: BoardSlug,
  opts: { search?: string; page?: number } = {}
): Promise<{ posts: Post[]; total: number; page: number; pageSize: number }> {
  const supabase = await createClient();
  const page = Math.max(1, opts.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("board", board)
    .eq("is_published", true)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (opts.search?.trim()) {
    query = query.ilike("title", `%${opts.search.trim()}%`);
  }

  const { data, count, error } = await query;
  if (error) return { posts: [], total: 0, page, pageSize: PAGE_SIZE };
  return { posts: (data ?? []) as Post[], total: count ?? 0, page, pageSize: PAGE_SIZE };
}

export async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return data as Post;
}

export async function getAttachments(postId: string): Promise<PostAttachment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("post_attachments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) return [];
  return (data ?? []) as PostAttachment[];
}

/** postId별 첨부파일 목록 — 갤러리·자료실 목록에서 썸네일/아이콘 표시용 */
export async function getAttachmentsForPosts(
  postIds: string[]
): Promise<Map<string, PostAttachment[]>> {
  const map = new Map<string, PostAttachment[]>();
  if (postIds.length === 0) return map;

  const supabase = await createClient();
  const { data } = await supabase
    .from("post_attachments")
    .select("*")
    .in("post_id", postIds)
    .order("created_at", { ascending: true });

  for (const a of (data ?? []) as PostAttachment[]) {
    const list = map.get(a.post_id) ?? [];
    list.push(a);
    map.set(a.post_id, list);
  }
  return map;
}

export async function incrementViewCount(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.rpc("increment_view_count", { post_id: id });
}

export type HomeAnnouncement = { type: string; title: string; date: string; href: string };

/** 홈 "최신 소식" — 공지사항 최신 N건 (고정글 우선) */
export async function getLatestNotices(limit = 3): Promise<HomeAnnouncement[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, created_at")
    .eq("board", "notice")
    .eq("is_published", true)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((p) => ({
    type: "공지사항",
    title: p.title,
    date: formatDate(p.created_at),
    href: `/board/notice/${p.id}`,
  }));
}
