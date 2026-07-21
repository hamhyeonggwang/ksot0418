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

export function StaticSitePage({
  config,
  extra,
  extraBefore,
}: {
  config: StaticPageConfig;
  /** Supabase posts 등 서버에서 조회한 CMS 섹션 — 정적 content.html 뒤에 이어서 렌더 */
  extra?: React.ReactNode;
  /** 정적 content.html 앞에 렌더할 CMS 섹션 (예: 캘린더보다 먼저 노출할 공지) */
  extraBefore?: React.ReactNode;
}) {
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
            <div className="min-w-0">
              {extraBefore}
              <StaticPageContent
                html={config.content.html}
                extraCss={config.content.extraCss}
              />
              {extra}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
