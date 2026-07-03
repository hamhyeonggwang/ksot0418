"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deletePost } from "@/lib/board-admin";

export function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm("이 게시글을 삭제하시겠습니까? 되돌릴 수 없습니다.")) return;
    setPending(true);
    const { error } = await deletePost(postId);
    setPending(false);
    if (error) {
      alert(`삭제 실패: ${error}`);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      aria-label="삭제"
      className="shrink-0 rounded-full p-1.5 text-muted transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
