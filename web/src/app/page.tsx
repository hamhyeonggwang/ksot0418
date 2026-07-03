import { HeroSection } from "@/components/home/HeroSection";
import { LatestContentSection } from "@/components/home/LatestContentSection";
import { ResearchAreasSection } from "@/components/home/ResearchAreasSection";
import { ConferenceEducationSection } from "@/components/home/ConferenceEducationSection";
import { MediaCommunitySection } from "@/components/home/MediaCommunitySection";
import { getLatestNotices } from "@/lib/board";

export default async function HomePage() {
  const announcements = await getLatestNotices(3);

  return (
    <>
      <HeroSection />
      <LatestContentSection announcements={announcements} />
      <ResearchAreasSection />
      <ConferenceEducationSection />
      <MediaCommunitySection />
    </>
  );
}
