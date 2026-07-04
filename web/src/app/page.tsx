import { HeroSection } from "@/components/home/HeroSection";
import { ResearchAreasSection } from "@/components/home/ResearchAreasSection";
import { PopupNoticeLayer } from "@/components/home/PopupNoticeLayer";
import { getActivePopups } from "@/lib/popup";

export default async function HomePage() {
  const popups = await getActivePopups();

  return (
    <>
      <PopupNoticeLayer popups={popups} />
      <HeroSection />
      <ResearchAreasSection />
    </>
  );
}
