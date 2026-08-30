import { AnnouncementCard } from "@/components/announcements/announcement-card";
import { EmptyState } from "@/components/layout/empty-state";
import type { Tables } from "@/types/database";

type AnnouncementListProps = {
  announcements: Tables<"announcements">[];
};

export function AnnouncementList({ announcements }: AnnouncementListProps) {
  if (announcements.length === 0) {
    return (
      <EmptyState
        title="No announcements yet"
        description="Club updates from the E-Board will appear here."
      />
    );
  }

  return (
    <ul className="mt-8 grid gap-4">
      {announcements.map((announcement) => (
        <li key={announcement.id} className="min-h-0 h-full">
          <AnnouncementCard announcement={announcement} />
        </li>
      ))}
    </ul>
  );
}
