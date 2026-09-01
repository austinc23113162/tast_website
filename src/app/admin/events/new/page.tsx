import type { Metadata } from "next";

import { EventForm } from "@/components/admin/event-form";

export const metadata: Metadata = {
  title: "New event",
};

export default function NewEventPage() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-foreground">New event</h2>
      <EventForm />
    </div>
  );
}
