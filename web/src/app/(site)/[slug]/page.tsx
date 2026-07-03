import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticSitePage } from "@/components/pages/StaticSitePage";
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
  return <StaticSitePage config={staticPages[slug]} />;
}
