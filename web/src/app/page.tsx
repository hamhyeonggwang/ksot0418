import { HeroSection } from "@/components/home/HeroSection";
import { ResearchAreasSection } from "@/components/home/ResearchAreasSection";
import { NoticeBoardsSection } from "@/components/home/NoticeBoardsSection";
import { GalleryPreviewSection } from "@/components/home/GalleryPreviewSection";
import { PopupNoticeLayer } from "@/components/home/PopupNoticeLayer";
import { getActivePopups } from "@/lib/popup";
import { getPosts, getAttachmentsForPosts } from "@/lib/board";

export default async function HomePage() {
  const [popups, { posts: notices }, { posts: educationNotices }, { posts: galleryPosts }] =
    await Promise.all([
      getActivePopups(),
      getPosts("notice", { page: 1 }),
      getPosts("education", { page: 1 }),
      getPosts("gallery", { page: 1 }),
    ]);
  const galleryAttachments = await getAttachmentsForPosts(
    galleryPosts.slice(0, 3).map((p) => p.id)
  );

  return (
    <>
      <PopupNoticeLayer popups={popups} />
      <HeroSection />
      <NoticeBoardsSection
        notices={notices.slice(0, 5)}
        educationNotices={educationNotices.slice(0, 5)}
      />
      <ResearchAreasSection />
      <GalleryPreviewSection posts={galleryPosts} attachmentsByPost={galleryAttachments} />
    </>
  );
}
