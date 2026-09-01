import type { Metadata } from "next";
import Link from "next/link";

import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { deleteAnnouncementAction } from "@/lib/admin/actions";
import { formatAnnouncementDate } from "@/lib/datetime";
import { listAnnouncements } from "@/lib/db/announcements";

export const metadata: Metadata = {
  title: "Admin announcements",
};

export default async function AdminAnnouncementsPage() {
  const announcements = await listAnnouncements();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-foreground">Announcements</h2>
        <Button render={<Link href="/admin/announcements/new" />}>
          New announcement
        </Button>
      </div>
      {announcements.length === 0 ? (
        <EmptyState
          title="No announcements yet"
          description="Publish a note to show it on the homepage."
        />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {announcements.map((announcement) => (
            <li
              key={announcement.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">
                  {announcement.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatAnnouncementDate(announcement.created_at)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  render={
                    <Link href={`/admin/announcements/${announcement.id}/edit`} />
                  }
                >
                  Edit
                </Button>
                <ConfirmDeleteButton
                  action={deleteAnnouncementAction.bind(null, announcement.id)}
                  label="Delete"
                  message={`Delete “${announcement.title}”?`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
