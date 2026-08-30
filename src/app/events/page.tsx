import type { Metadata } from "next";

import { EventList } from "@/components/events/event-list";
import { PageHeader } from "@/components/layout/page-header";
import { SiteContainer } from "@/components/layout/site-container";
import { listUpcomingEvents } from "@/lib/db/events";

export const metadata: Metadata = {
  title: "Upcoming events",
};

export default async function EventsPage() {
  const events = await listUpcomingEvents();

  return (
    <SiteContainer id="main-content">
      <PageHeader
        title="Upcoming events"
        description="Dinners, cultural nights, and study breaks hosted by TAST. Sample listings are shown until the E-Board publishes the live calendar."
      />
      <EventList
        events={events}
        emptyTitle="No upcoming events yet"
        emptyDescription="Event listings will appear here once the E-Board publishes the calendar."
      />
    </SiteContainer>
  );
}
