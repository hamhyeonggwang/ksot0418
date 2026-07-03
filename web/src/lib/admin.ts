import "server-only";
import { createClient } from "@/lib/supabase/server";

/** 현재 요청의 로그인 사용자가 관리자인지 확인 (Server Component 전용) */
export async function getCurrentAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id, email")
    .eq("user_id", user.id)
    .maybeSingle();

  return admin ? { userId: admin.user_id, email: admin.email } : null;
}
