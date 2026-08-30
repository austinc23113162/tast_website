import type { Metadata } from "next";

import { EventList } from "@/components/events/event-list";
import { PageHeader } from "@/components/layout/page-header";
import { SiteContainer } from "@/components/layout/site-container";
import { listPastEvents } from "@/lib/db/events";

export const metadata: Metadata = {
  title: "Past events",
};

export default async function PastEventsPage() {
  const events = await listPastEvents();

  return (
    <SiteContainer id="main-content">
      <PageHeader
        title="Past events"
        description="A look back at recent TAST gatherings. Recaps and photos will be added here later."
      />
      <EventList
        events={events}
        emptyTitle="No past events yet"
        emptyDescription="After events wrap up, they will be archived here with recaps and pictures."
      />
    </SiteContainer>
  );
}
