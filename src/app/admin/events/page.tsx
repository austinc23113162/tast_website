import type { Metadata } from "next";
import Link from "next/link";

import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { deleteEventAction } from "@/lib/admin/actions";
import { formatEventRange } from "@/lib/datetime";
import { listEvents } from "@/lib/db/events";

export const metadata: Metadata = {
  title: "Admin events",
};

export default async function AdminEventsPage() {
  const events = await listEvents();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-foreground">Events</h2>
        <Button render={<Link href="/admin/events/new" />}>New event</Button>
      </div>
      {events.length === 0 ? (
        <EmptyState
          title="No events yet"
          description="Create an event to show it on the public calendar."
        />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">{event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatEventRange(event.start_time, event.end_time)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  render={<Link href={`/admin/events/${event.id}/edit`} />}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  render={<Link href={`/admin/events/${event.id}/photos`} />}
                >
                  Photos
                </Button>
                <Button
                  variant="outline"
                  render={<Link href={`/admin/events/${event.id}/attendance`} />}
                >
                  Attendance
                </Button>
                <ConfirmDeleteButton
                  action={deleteEventAction.bind(null, event.id)}
                  label="Delete"
                  message={`Delete “${event.title}”? This also removes its photos and attendance.`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
