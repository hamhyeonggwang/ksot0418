import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PopupForm } from "@/components/admin/PopupForm";
import { getPopup } from "@/lib/popup";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "팝업 공지 수정 | KSOT",
};

export default async function EditPopupPage({ params }: Props) {
  const { id } = await params;
  const popup = await getPopup(id);
  if (!popup) notFound();

  return <PopupForm initialPopup={popup} />;
}
