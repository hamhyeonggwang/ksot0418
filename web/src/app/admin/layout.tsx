import Link from "next/link";
import { getCurrentAdmin } from "@/lib/admin";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F8FAFC] px-4">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col bg-[#F8FAFC] lg:flex-row">
      <aside className="w-full shrink-0 border-b border-[#1A2B4C]/8 bg-white p-6 lg:w-56 lg:border-b-0 lg:border-r">
        <p className="text-xs font-bold uppercase tracking-wider text-muted">Admin</p>
        <nav className="mt-4 flex gap-1 lg:flex-col">
          <Link
            href="/admin"
            className="rounded-lg px-3 py-2 text-sm font-medium text-[#1A2B4C] hover:bg-[#F8FAFC]"
          >
            대시보드
          </Link>
          <Link
            href="/admin/posts"
            className="rounded-lg px-3 py-2 text-sm font-medium text-[#1A2B4C] hover:bg-[#F8FAFC]"
          >
            게시글 관리
          </Link>
        </nav>
        <div className="mt-8 border-t border-[#1A2B4C]/8 pt-4">
          <p className="truncate text-xs text-muted">{admin.email}</p>
          <LogoutButton />
        </div>
      </aside>
      <div className="flex-1 p-6 sm:p-10">{children}</div>
    </div>
  );
}
