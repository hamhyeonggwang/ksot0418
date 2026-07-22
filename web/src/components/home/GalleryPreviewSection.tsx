import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { attachmentUrl, type Post, type PostAttachment } from "@/lib/board-types";

type Props = {
  posts: Post[];
  attachmentsByPost: Map<string, PostAttachment[]>;
};

export function GalleryPreviewSection({ posts, attachmentsByPost }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-[#F8FAFC] py-16 sm:py-20" id="gallery-preview">
      <Container>
        <SectionHeader
          label="Gallery"
          title="학회"
          titleAccent="갤러리"
          description="학술대회·보수교육·학회 행사 현장을 사진으로 만나보세요."
          action={
            <Link
              href="/community#gallery"
              className="inline-flex items-center gap-2 rounded-full bg-[#1A2B4C] px-5 py-2.5 text-sm font-semibold text-white"
            >
              전체보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {posts.slice(0, 3).map((p) => {
            const thumb = attachmentsByPost.get(p.id)?.[0];
            return (
              <Link
                key={p.id}
                href={`/board/gallery/${p.id}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-[#1A2B4C]/5"
              >
                {thumb ? (
                  <Image
                    src={attachmentUrl(thumb.storage_path)}
                    alt={p.title}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted">
                    <ImageIcon className="h-9 w-9" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <span className="line-clamp-1 text-sm font-medium text-white">{p.title}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
