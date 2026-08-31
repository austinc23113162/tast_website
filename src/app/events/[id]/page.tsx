import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { formatEventRange } from "@/lib/datetime";
import { getEventById, listEvents } from "@/lib/db/events";

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const events = await listEvents();
  return events.map((event) => ({ id: event.id }));
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) {
    return { title: "Event not found" };
  }
  return { title: event.title };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <PageShell
      eyebrow="Events"
      title={event.title}
      description={formatEventRange(event.start_time, event.end_time)}
    >
      <p className="text-sm text-muted-foreground">
        <Link href="/events" className="underline-offset-4 hover:underline">
          Back to upcoming events
        </Link>
      </p>
      <dl className="mt-8 max-w-2xl space-y-4 text-sm">
        <div>
          <dt className="font-medium text-foreground">When</dt>
          <dd className="mt-1 text-muted-foreground">
            {formatEventRange(event.start_time, event.end_time)}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Where</dt>
          <dd className="mt-1 text-muted-foreground">
            {event.location ?? "Location to be announced"}
          </dd>
        </div>
      </dl>
      {event.description ? (
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {event.description}
        </p>
      ) : null}
      {event.registration_url ? (
        <div className="mt-8">
          <Button
            render={
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            RSVP
          </Button>
        </div>
      ) : null}
    </PageShell>
  );
}
