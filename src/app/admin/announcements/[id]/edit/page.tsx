import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnnouncementForm } from "@/components/admin/announcement-form";
import { getAnnouncementById } from "@/lib/db/announcements";

type EditAnnouncementPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditAnnouncementPageProps): Promise<Metadata> {
  const { id } = await params;
  const announcement = await getAnnouncementById(id);
  return {
    title: announcement ? `Edit ${announcement.title}` : "Announcement not found",
  };
}

export default async function EditAnnouncementPage({
  params,
}: EditAnnouncementPageProps) {
  const { id } = await params;
  const announcement = await getAnnouncementById(id);
  if (!announcement) {
    notFound();
  }

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-foreground">
        Edit announcement
      </h2>
      <AnnouncementForm announcement={announcement} />
    </div>
  );
}
