import type { Metadata } from "next";
import { PostForm } from "@/components/admin/PostForm";

export const metadata: Metadata = {
  title: "새 글 작성 | KSOT",
};

export default function NewPostPage() {
  return <PostForm />;
}
