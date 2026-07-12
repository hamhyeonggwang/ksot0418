import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { attachmentUrl, type Post, type PostAttachment } from "@/lib/board-types";

type Props = {
  posts: Post[];
  attachmentsByPost: Map<string, PostAttachment[]>;
};

/** 커뮤니티 페이지 갤러리 — 관리자가 올린 실제 사진으로 대체 (기존 placeholder 그라디언트 제거) */
export function GallerySection({ posts, attachmentsByPost }: Props) {
  return (
    <section className="content-section" id="gallery">
      <div className="content-header">
        <h2>
          <ImageIcon className="h-[18px] w-[18px] text-[#1A2B4C]" />
          학회 갤러리
        </h2>
        <div className="content-actions">
          <Link
            href="/board/gallery"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#14B8A6] hover:underline"
          >
            전체보기
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
      <p className="mb-5 text-[14.5px] leading-relaxed text-[var(--text-mid)]">
        학술대회·보수교육·학회 행사 현장을 사진으로 만나보세요.
      </p>

      {posts.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">등록된 사진이 없습니다.</p>
      ) : (
        <div className="gallery-grid">
          {posts.slice(0, 6).map((p) => {
            const thumb = attachmentsByPost.get(p.id)?.[0];
            return (
              <Link key={p.id} href={`/board/gallery/${p.id}`} className="gallery-item">
                {thumb ? (
                  <Image
                    src={attachmentUrl(thumb.storage_path)}
                    alt={p.title}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="h-9 w-9" />
                )}
                <div className="overlay">
                  <span>{p.title}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
