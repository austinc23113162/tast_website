import type { Metadata } from "next";

import { EventList } from "@/components/events/event-list";
import { PageShell } from "@/components/layout/page-hero";
import { listUpcomingEvents } from "@/lib/db/events";

export const metadata: Metadata = {
  title: "Upcoming events",
};

export default async function EventsPage() {
  const events = await listUpcomingEvents();

  return (
    <PageShell
      eyebrow="Events"
      title="Upcoming events"
      description="Dinners, cultural nights, and study breaks hosted by TAST."
    >
      <EventList
        events={events}
        emptyTitle="No upcoming events yet"
        emptyDescription="Event listings will appear here once the E-Board publishes the calendar."
      />
    </PageShell>
  );
}
