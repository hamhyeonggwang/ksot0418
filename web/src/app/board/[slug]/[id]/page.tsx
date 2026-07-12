import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Eye, Paperclip } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MarkdownBody } from "@/components/board/MarkdownBody";
import { AdminActions } from "@/components/board/AdminActions";
import { getPost, getAttachments, incrementViewCount } from "@/lib/board";
import {
  BOARD_LABELS,
  isBoardSlug,
  formatDate,
  formatBytes,
  attachmentUrl,
} from "@/lib/board-types";
import { getCurrentAdmin } from "@/lib/admin";

type Props = {
  params: Promise<{ slug: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  return {
    title: post ? `${post.title} | KSOT` : "게시글을 찾을 수 없습니다 | KSOT",
  };
}

export default async function BoardDetailPage({ params }: Props) {
  const { slug, id } = await params;
  if (!isBoardSlug(slug)) notFound();

  const post = await getPost(id);
  if (!post || post.board !== slug) notFound();

  const [attachments, admin] = await Promise.all([getAttachments(id), getCurrentAdmin()]);

  if (post.is_published) {
    await incrementViewCount(id);
  }

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/board/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-[#1A2B4C]"
          >
            <ArrowLeft className="h-4 w-4" />
            {BOARD_LABELS[slug]} 목록으로
          </Link>
          {admin && <AdminActions postId={id} boardSlug={slug} />}
        </div>

        {!post.is_published && (
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
            비공개 게시글 (관리자만 열람 가능)
          </p>
        )}

        <h1 className="mt-6 text-2xl font-bold leading-snug text-[#1A2B4C] sm:text-3xl">
          {post.title}
        </h1>

        <div className="mt-3 flex items-center gap-4 text-sm text-muted">
          <span>{formatDate(post.created_at)}</span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {post.view_count}
          </span>
        </div>

        {slug === "gallery" && attachments.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {attachments.map((a) => (
              <a
                key={a.id}
                href={attachmentUrl(a.storage_path)}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-[#1A2B4C]/5"
              >
                <Image
                  src={attachmentUrl(a.storage_path)}
                  alt={a.file_name}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </a>
            ))}
          </div>
        )}

        <MarkdownBody body={post.body} />

        {slug !== "gallery" && attachments.length > 0 && (
          <div className="mt-10 border-t border-[#1A2B4C]/8 pt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted">첨부파일</h2>
            <ul className="mt-3 space-y-2">
              {attachments.map((a) => (
                <li key={a.id}>
                  <a
                    href={attachmentUrl(a.storage_path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-2 text-sm font-medium text-[#1A2B4C] hover:text-[#14B8A6]"
                  >
                    <Paperclip className="h-4 w-4" />
                    {a.file_name}
                    {a.size_bytes && (
                      <span className="text-muted">({formatBytes(a.size_bytes)})</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
