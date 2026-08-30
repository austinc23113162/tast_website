import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Upcoming events",
};

export default function EventsPage() {
  return (
    <PlaceholderPage
      title="Upcoming events"
      description="Dinners, cultural nights, and study breaks hosted by TAST."
      emptyTitle="No upcoming events yet"
      emptyDescription="Event listings will appear here once the E-Board publishes the calendar."
    />
  );
}
