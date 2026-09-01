import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AttendanceForm } from "@/components/admin/attendance-form";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { removeAttendanceAction } from "@/lib/admin/actions";
import { formatEventDateTime } from "@/lib/datetime";
import { listAttendanceForEvent } from "@/lib/db/attendance";
import { getEventById } from "@/lib/db/events";

type EventAttendancePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EventAttendancePageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);
  return { title: event ? `Attendance · ${event.title}` : "Event not found" };
}

export default async function EventAttendancePage({
  params,
}: EventAttendancePageProps) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) {
    notFound();
  }

  const records = await listAttendanceForEvent(event.id);

  return (
    <div className="grid gap-10">
      <div>
        <Button
          variant="ghost"
          render={<Link href={`/admin/events/${event.id}/edit`} />}
        >
          Back to event
        </Button>
        <h2 className="mt-2 text-xl font-semibold text-foreground">
          Attendance · {event.title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {records.length} check-in{records.length === 1 ? "" : "s"}
        </p>
      </div>
      <AttendanceForm eventId={event.id} />
      {records.length === 0 ? (
        <EmptyState
          title="No check-ins yet"
          description="Add a member by the email on their TAST account."
        />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {records.map((record) => (
            <li
              key={record.id}
              className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">{record.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {record.email ?? "No email"} ·{" "}
                  {formatEventDateTime(record.checked_in_at)}
                </p>
              </div>
              <ConfirmDeleteButton
                action={removeAttendanceAction.bind(
                  null,
                  record.id,
                  event.id
                )}
                label="Remove"
                message={`Remove ${record.full_name} from this event?`}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
