import { HeroSection } from "@/components/home/HeroSection";
import { QuickPathSection } from "@/components/home/QuickPathSection";
import { LatestContentSection } from "@/components/home/LatestContentSection";
import { ResearchAreasSection } from "@/components/home/ResearchAreasSection";
import { ConferenceEducationSection } from "@/components/home/ConferenceEducationSection";
import { MediaCommunitySection } from "@/components/home/MediaCommunitySection";

/**
 * Homepage information architecture (UX strategy)
 *
 * 1. Hero — immediate value prop + 4 primary CTAs (action over menu)
 * 2. QuickPath — persona-based 3-click paths
 * 3. Latest — bento feed (papers / CE / notices)
 * 4. Research — visual topic exploration
 * 5. Conference — poster + timeline + speakers (not bulletin board)
 * 6. Media — retention & engagement layer
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickPathSection />
      <LatestContentSection />
      <ResearchAreasSection />
      <ConferenceEducationSection />
      <MediaCommunitySection />
    </>
  );
}
