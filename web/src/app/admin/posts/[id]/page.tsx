import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { getPost, getAttachments } from "@/lib/board";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "게시글 수정 | KSOT",
};

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const [post, attachments] = await Promise.all([getPost(id), getAttachments(id)]);
  if (!post) notFound();

  return <PostForm initialPost={post} initialAttachments={attachments} />;
}
