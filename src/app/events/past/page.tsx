import type { Metadata } from "next";

import { EventList } from "@/components/events/event-list";
import { PageShell } from "@/components/layout/page-hero";
import { listPastEvents } from "@/lib/db/events";

export const metadata: Metadata = {
  title: "Past events",
};

export default async function PastEventsPage() {
  const events = await listPastEvents();

  return (
    <PageShell
      eyebrow="Events"
      title="Past events"
      description="A look back at recent TAST gatherings. Recaps and photos will be added here later."
    >
      <EventList
        events={events}
        emptyTitle="No past events yet"
        emptyDescription="After events wrap up, they will be archived here with recaps and pictures."
      />
    </PageShell>
  );
}
