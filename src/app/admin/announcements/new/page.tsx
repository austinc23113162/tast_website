import type { Metadata } from "next";

import { AnnouncementForm } from "@/components/admin/announcement-form";

export const metadata: Metadata = {
  title: "New announcement",
};

export default function NewAnnouncementPage() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-foreground">
        New announcement
      </h2>
      <AnnouncementForm />
    </div>
  );
}
