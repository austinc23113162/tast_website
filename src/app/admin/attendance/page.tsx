import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { formatEventRange } from "@/lib/datetime";
import { listEvents } from "@/lib/db/events";

export const metadata: Metadata = {
  title: "Admin attendance",
};

export default async function AdminAttendancePage() {
  const events = await listEvents();

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-foreground">Attendance</h2>
      {events.length === 0 ? (
        <EmptyState
          title="No events to track"
          description="Create an event first, then add check-ins from that event."
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
              <Button
                render={<Link href={`/admin/events/${event.id}/attendance`} />}
              >
                Manage check-ins
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
