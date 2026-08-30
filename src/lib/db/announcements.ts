import { placeholderAnnouncements } from "@/lib/db/placeholders";
import type { Tables } from "@/types/database";

export async function listAnnouncements(): Promise<Tables<"announcements">[]> {
  return [...placeholderAnnouncements].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function listLatestAnnouncements(
  limit = 3
): Promise<Tables<"announcements">[]> {
  const announcements = await listAnnouncements();
  return announcements.slice(0, limit);
}

