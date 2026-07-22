import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Megaphone } from "lucide-react";
import { StaticSitePage } from "@/components/pages/StaticSitePage";
import { BoardNoticeSection } from "@/components/pages/BoardNoticeSection";
import { GallerySection } from "@/components/pages/GallerySection";
import { CeScheduleCalendar } from "@/components/pages/CeScheduleCalendar";
import { getPosts, getAttachmentsForPosts } from "@/lib/board";
import {
  isStaticPageSlug,
  staticPageMetadata,
  staticPages,
  staticPageSlugs,
} from "@/lib/static-pages/config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return staticPageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isStaticPageSlug(slug)) return {};
  return staticPageMetadata(slug);
}

export default async function StaticPageRoute({ params }: Props) {
  const { slug } = await params;
  if (!isStaticPageSlug(slug)) notFound();

  if (slug === "education") {
    const { posts } = await getPosts("education", { page: 1 });
    return (
      <StaticSitePage
        config={staticPages.education}
        extraBefore={
          <>
            <BoardNoticeSection
              boardSlug="education"
              posts={posts.slice(0, 6)}
              title="보수교육 관련 공지"
              icon={CalendarDays}
            />
            <CeScheduleCalendar />
          </>
        }
      />
    );
  }

  if (slug === "community") {
    const [{ posts: noticePosts }, { posts: galleryPosts }, { posts: conferencePosts }] =
      await Promise.all([
        getPosts("notice", { page: 1 }),
        getPosts("gallery", { page: 1 }),
        getPosts("conference", { page: 1 }),
      ]);
    const attachmentsByPost = await getAttachmentsForPosts(
      galleryPosts.slice(0, 6).map((p) => p.id)
    );
    return (
      <StaticSitePage
        config={staticPages.community}
        extra={
          <>
            <BoardNoticeSection
              boardSlug="notice"
              posts={noticePosts.slice(0, 6)}
              title="공지사항"
              icon={Megaphone}
            />
            <GallerySection posts={galleryPosts} attachmentsByPost={attachmentsByPost} />
            <BoardNoticeSection
              boardSlug="conference"
              posts={conferencePosts.slice(0, 6)}
              title="학술대회 공지"
              icon={Megaphone}
            />
          </>
        }
      />
    );
  }

  return <StaticSitePage config={staticPages[slug]} />;
}
