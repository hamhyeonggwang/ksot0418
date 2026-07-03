"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/supabase/auth";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-[#1A2B4C]"
    >
      <LogOut className="h-3.5 w-3.5" />
      로그아웃
    </button>
  );
}
