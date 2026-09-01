import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EventForm } from "@/components/admin/event-form";
import { Button } from "@/components/ui/button";
import { getEventById } from "@/lib/db/events";

type EditEventPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditEventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);
  return { title: event ? `Edit ${event.title}` : "Event not found" };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-foreground">Edit event</h2>
        <div className="flex flex-wrap gap-2">
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
          <Button variant="ghost" render={<Link href={`/events/${event.id}`} />}>
            View public page
          </Button>
        </div>
      </div>
      <EventForm event={event} />
    </div>
  );
}
