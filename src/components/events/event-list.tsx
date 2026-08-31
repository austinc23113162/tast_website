import { EventCard } from "@/components/events/event-card";
import { EmptyState } from "@/components/layout/empty-state";
import { Reveal } from "@/components/motion/reveal";
import type { Tables } from "@/types/database";

type EventListProps = {
  events: Tables<"events">[];
  emptyTitle: string;
  emptyDescription: string;
};

export function EventList({
  events,
  emptyTitle,
  emptyDescription,
}: EventListProps) {
  if (events.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {events.map((event, index) => (
        <li key={event.id} className="min-h-0 h-full">
          <Reveal className="h-full" delayMs={index * 60}>
            <EventCard event={event} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
