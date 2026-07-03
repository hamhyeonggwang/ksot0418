"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deletePost } from "@/lib/board-admin";

export function AdminActions({ postId, boardSlug }: { postId: string; boardSlug: string }) {
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
    router.push(`/board/${boardSlug}`);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/posts/${postId}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#1A2B4C]/12 bg-white px-3 py-1.5 text-xs font-semibold text-[#1A2B4C] transition hover:border-[#2DD4BF]/40"
      >
        <Pencil className="h-3.5 w-3.5" />
        수정
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:border-red-400 disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        삭제
      </button>
    </div>
  );
}
