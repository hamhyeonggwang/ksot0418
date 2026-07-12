import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pin, Paperclip, Calendar, MapPin, Award, Image as ImageIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getPosts, getAttachmentsForPosts } from "@/lib/board";
import {
  BOARD_LABELS,
  isBoardSlug,
  formatDate,
  attachmentUrl,
  type PostAttachment,
} from "@/lib/board-types";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isBoardSlug(slug)) return {};
  return { title: `${BOARD_LABELS[slug]} | KSOT` };
}

export default async function BoardListPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { q, page: pageParam } = await searchParams;
  if (!isBoardSlug(slug)) notFound();

  const page = Number(pageParam) > 0 ? Number(pageParam) : 1;
  const { posts, total, pageSize } = await getPosts(slug, { search: q, page });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const attachmentsByPost =
    slug === "resources" || slug === "gallery"
      ? await getAttachmentsForPosts(posts.map((p) => p.id))
      : new Map<string, PostAttachment[]>();
  const attachmentPostIds = new Set(attachmentsByPost.keys());

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-4xl">
        <SectionHeader
          label="Board"
          title={BOARD_LABELS[slug]}
          description={`전체 ${total}건`}
        />

        <form className="mb-6 flex gap-3" action={`/board/${slug}`}>
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="제목 검색…"
            className="flex-1 rounded-2xl border border-[#1A2B4C]/12 bg-white px-5 py-3 text-base text-[#1A2B4C] placeholder:text-muted outline-none focus:border-[#2DD4BF]/60"
          />
          <button
            type="submit"
            className="rounded-2xl bg-[#1A2B4C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#243B66]"
          >
            검색
          </button>
        </form>

        {posts.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted">등록된 게시글이 없습니다.</p>
        ) : slug === "education" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/board/${slug}/${p.id}`}
                className="rounded-2xl border border-[#1A2B4C]/8 bg-white p-5 transition hover:border-[#2DD4BF]/40"
              >
                <div className="flex items-center justify-between gap-2">
                  {p.event_date && (
                    <span className="flex items-center gap-1.5 text-xs font-mono text-muted">
                      <Calendar className="h-3.5 w-3.5" />
                      {p.event_date}
                    </span>
                  )}
                  {p.is_pinned && <Pin className="h-3.5 w-3.5 text-[#14B8A6]" />}
                </div>
                <p className="mt-2 font-semibold text-[#1A2B4C]">{p.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                  {p.place && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {p.place}
                    </span>
                  )}
                  {p.credits && (
                    <span className="flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" />
                      {p.credits}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : slug === "gallery" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => {
              const thumb = attachmentsByPost.get(p.id)?.[0];
              return (
                <Link
                  key={p.id}
                  href={`/board/${slug}/${p.id}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#1A2B4C]/5"
                >
                  {thumb ? (
                    <Image
                      src={attachmentUrl(thumb.storage_path)}
                      alt={p.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <span className="text-sm font-medium text-white">{p.title}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <ul className="divide-y divide-[#1A2B4C]/8 rounded-2xl border border-[#1A2B4C]/8 bg-white">
            {posts.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/board/${slug}/${p.id}`}
                  className="flex items-center gap-3 px-5 py-4 transition hover:bg-[#F8FAFC]"
                >
                  {p.is_pinned && <Pin className="h-4 w-4 shrink-0 text-[#14B8A6]" />}
                  <span className="flex-1 truncate text-sm font-medium text-[#1A2B4C]">
                    {p.title}
                  </span>
                  {attachmentPostIds.has(p.id) && (
                    <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted" />
                  )}
                  <span className="shrink-0 text-xs text-muted">
                    {formatDate(p.created_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={`/board/${slug}?${new URLSearchParams({
                  ...(q ? { q } : {}),
                  page: String(n),
                })}`}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${
                  n === page
                    ? "bg-[#1A2B4C] text-white"
                    : "text-muted hover:bg-[#F8FAFC]"
                }`}
              >
                {n}
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
