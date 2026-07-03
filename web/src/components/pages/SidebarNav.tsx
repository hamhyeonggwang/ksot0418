import Link from "next/link";
import { type LucideIcon } from "lucide-react";

export type SidebarItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
  children?: { label: string; href: string }[];
};

type Props = {
  title: string;
  icon: LucideIcon;
  items: SidebarItem[];
};

export function SidebarNav({ title, icon: Icon, items }: Props) {
  return (
    <nav className="overflow-hidden rounded-2xl border border-[#1A2B4C]/8 bg-white shadow-[0_4px_24px_rgba(26,43,76,0.06)]">
      <div className="flex items-center gap-2.5 bg-[#1A2B4C] px-5 py-4 text-sm font-bold text-white">
        <Icon className="h-4 w-4 text-[#2DD4BF]" />
        {title}
      </div>
      <ul className="divide-y divide-[#1A2B4C]/6 py-1">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link
              href={item.href}
              className="flex items-center gap-2.5 px-5 py-3 text-sm font-medium text-muted transition-colors hover:bg-[#F8FAFC] hover:text-[#1A2B4C]"
            >
              {item.icon && (
                <item.icon className="h-4 w-4 shrink-0 text-[#14B8A6]/70" />
              )}
              {item.label}
            </Link>
            {item.children && (
              <ul className="mb-2 ml-5 border-l-2 border-[#1A2B4C]/8 pl-3">
                {item.children.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className="block py-1.5 text-xs text-muted transition-colors hover:text-[#14B8A6]"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SidebarContactCard() {
  return (
    <div className="mt-4 rounded-2xl bg-[#1A2B4C] p-5 text-white">
      <h5 className="mb-2 text-sm font-bold text-[#2DD4BF]">문의</h5>
      <p className="text-xs leading-relaxed text-white/70">
        행정·보수교육
        <br />
        <a
          href="mailto:ksotoffice@naver.com"
          className="font-medium text-white hover:underline"
        >
          ksotoffice@naver.com
        </a>
      </p>
      <p className="mt-3 text-xs leading-relaxed text-white/70">
        학술지·학술대회
        <br />
        <a
          href="mailto:ksot.editor@gmail.com"
          className="font-medium text-white hover:underline"
        >
          ksot.editor@gmail.com
        </a>
      </p>
    </div>
  );
}
