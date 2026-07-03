import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/pages/PageHero";
import {
  SidebarNav,
  SidebarContactCard,
  type SidebarItem,
} from "@/components/pages/SidebarNav";
import { StaticPageContent } from "@/components/pages/StaticPageContent";
import type { PageHeroMeta } from "@/components/pages/PageHero";
import type { LucideIcon } from "lucide-react";

export type StaticPageConfig = {
  slug: string;
  metadata: { title: string; description: string };
  hero: {
    label: string;
    labelIcon?: LucideIcon;
    title: string;
    titleAccent?: string;
    description: string;
    breadcrumb: string;
    meta?: PageHeroMeta[];
  };
  sidebar: {
    title: string;
    icon: LucideIcon;
    items: SidebarItem[];
  };
  showContactCard?: boolean;
  content: { html: string; extraCss?: string };
};

export function StaticSitePage({ config }: { config: StaticPageConfig }) {
  return (
    <>
      <PageHero {...config.hero} />
      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-[240px_1fr] lg:gap-10">
            <aside className="lg:sticky lg:top-24">
              <SidebarNav
                title={config.sidebar.title}
                icon={config.sidebar.icon}
                items={config.sidebar.items}
              />
              {config.showContactCard !== false && <SidebarContactCard />}
            </aside>
            <StaticPageContent
              html={config.content.html}
              extraCss={config.content.extraCss}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
