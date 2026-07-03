import Link from "next/link";
import { ChevronRight, Home, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";

export type PageHeroMeta = {
  icon?: LucideIcon;
  text: string;
};

type Props = {
  label: string;
  labelIcon?: LucideIcon;
  title: string;
  titleAccent?: string;
  description: string;
  breadcrumb?: string;
  meta?: PageHeroMeta[];
};

export function PageHero({
  label,
  labelIcon: LabelIcon,
  title,
  titleAccent,
  description,
  breadcrumb,
  meta,
}: Props) {
  return (
    <section className="border-b border-[#1A2B4C]/8 bg-white py-16 sm:py-20">
      <Container>
        {breadcrumb && (
          <nav
            aria-label="breadcrumb"
            className="mb-4 flex items-center gap-1.5 text-sm text-muted"
          >
            <Link
              href="/"
              className="flex items-center gap-1 transition-colors hover:text-[#1A2B4C]"
            >
              <Home className="h-3.5 w-3.5" />
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-40" />
            <span className="font-medium text-[#1A2B4C]">{breadcrumb}</span>
          </nav>
        )}

        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#2DD4BF]/15 px-3 py-1 text-xs font-bold tracking-widest text-[#14B8A6] uppercase">
          {LabelIcon && <LabelIcon className="h-3.5 w-3.5" />}
          {label}
        </span>

        <h1 className="text-3xl font-bold tracking-tight text-[#1A2B4C] sm:text-4xl">
          {title}
          {titleAccent && (
            <span className="text-[#14B8A6]"> {titleAccent}</span>
          )}
        </h1>

        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
          {description}
        </p>

        {meta && meta.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {meta.map((item) => (
              <span
                key={item.text}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#1A2B4C]/10 bg-[#F8FAFC] px-3.5 py-1.5 text-xs font-medium text-[#1A2B4C]"
              >
                {item.icon && (
                  <item.icon className="h-3.5 w-3.5 text-[#14B8A6]" />
                )}
                {item.text}
              </span>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
