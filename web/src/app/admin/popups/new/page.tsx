import type { Metadata } from "next";
import { PopupForm } from "@/components/admin/PopupForm";

export const metadata: Metadata = {
  title: "새 팝업 공지 | KSOT",
};

export default function NewPopupPage() {
  return <PopupForm />;
}
