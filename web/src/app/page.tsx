import { HeroSection } from "@/components/home/HeroSection";
import { ResearchAreasSection } from "@/components/home/ResearchAreasSection";
import { NoticeBoardsSection } from "@/components/home/NoticeBoardsSection";
import { PopupNoticeLayer } from "@/components/home/PopupNoticeLayer";
import { getActivePopups } from "@/lib/popup";
import { getPosts } from "@/lib/board";

export default async function HomePage() {
  const [popups, { posts: notices }, { posts: educationNotices }] = await Promise.all([
    getActivePopups(),
    getPosts("notice", { page: 1 }),
    getPosts("education", { page: 1 }),
  ]);

  return (
    <>
      <PopupNoticeLayer popups={popups} />
      <HeroSection />
      <NoticeBoardsSection
        notices={notices.slice(0, 5)}
        educationNotices={educationNotices.slice(0, 5)}
      />
      <ResearchAreasSection />
    </>
  );
}
