import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Past events",
};

export default function PastEventsPage() {
  return (
    <PlaceholderPage
      title="Past events"
      description="A look back at recent TAST gatherings and photos."
      emptyTitle="No past events yet"
      emptyDescription="After events wrap up, they will be archived here with recaps and pictures."
    />
  );
}
