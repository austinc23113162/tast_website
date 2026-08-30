import { partitionEventsByTime } from "@/lib/datetime";
import { findById } from "@/lib/db/event-queries";
import { placeholderEvents } from "@/lib/db/placeholders";
import type { Tables } from "@/types/database";

export async function listEvents(): Promise<Tables<"events">[]> {
  return [...placeholderEvents];
}

export async function listUpcomingEvents(
  now: Date = new Date()
): Promise<Tables<"events">[]> {
  const { upcoming } = partitionEventsByTime(await listEvents(), now);
  return upcoming;
}

export async function listPastEvents(
  now: Date = new Date()
): Promise<Tables<"events">[]> {
  const { past } = partitionEventsByTime(await listEvents(), now);
  return past;
}

export async function getEventById(
  id: string
): Promise<Tables<"events"> | null> {
  return findById(placeholderEvents, id);
}
