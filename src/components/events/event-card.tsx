import Link from "next/link";

import { Button } from "@/components/ui/button";
import { formatEventRange } from "@/lib/datetime";
import type { Tables } from "@/types/database";

type EventCardProps = {
  event: Tables<"events">;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="content-card flex h-full min-h-0 flex-col rounded-xl border border-border bg-card p-5">
      <h2 className="line-clamp-1 text-lg font-semibold break-words text-foreground">
        <Link
          href={`/events/${event.id}`}
          className="underline-offset-4 hover:underline"
          title={event.title}
        >
          {event.title}
        </Link>
      </h2>
      <p className="mt-2 line-clamp-1 min-h-[1lh] text-sm text-muted-foreground">
        {formatEventRange(event.start_time, event.end_time)}
      </p>
      <p
        className="mt-1 line-clamp-1 min-h-[1lh] text-sm break-words text-muted-foreground"
        title={event.location ?? undefined}
      >
        {event.location ?? "\u00a0"}
      </p>
      <p
        className="mt-3 line-clamp-3 min-h-[3lh] flex-1 text-sm leading-relaxed break-words text-muted-foreground"
        title={event.description ?? undefined}
      >
        {event.description ?? "\u00a0"}
      </p>
      <div className="mt-4">
        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/events/${event.id}`} />}
        >
          Event details
        </Button>
      </div>
    </article>
  );
}
