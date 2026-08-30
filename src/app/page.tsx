import Link from "next/link";

import { AnnouncementList } from "@/components/announcements/announcement-list";
import { EventCard } from "@/components/events/event-card";
import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { listLatestAnnouncements } from "@/lib/db/announcements";
import { listUpcomingEvents } from "@/lib/db/events";

export default async function HomePage() {
  const [announcements, upcoming] = await Promise.all([
    listLatestAnnouncements(3),
    listUpcomingEvents(),
  ]);
  const featuredEvents = upcoming.slice(0, 2);

  return (
    <SiteContainer id="main-content">
      <p className="text-sm font-medium tracking-wide text-accent uppercase">
        Tufts University
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Taiwanese Association of Students at Tufts
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
        A home for Taiwanese students and friends at Tufts. Browse upcoming
        gatherings, meet the E-Board, and stay in the loop.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button render={<Link href="/events" />}>Upcoming events</Button>
        <Button variant="outline" render={<Link href="/about" />}>
          About TAST
        </Button>
      </div>

      <section className="mt-16" aria-labelledby="announcements-heading">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="announcements-heading"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            Latest announcements
          </h2>
        </div>
        <AnnouncementList announcements={announcements} />
      </section>

      <section className="mt-16" aria-labelledby="upcoming-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2
            id="upcoming-heading"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            Coming up
          </h2>
          <Button variant="link" render={<Link href="/events" />}>
            All upcoming events
          </Button>
        </div>
        {featuredEvents.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            No upcoming events are on the calendar yet.
          </p>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {featuredEvents.map((event) => (
              <li key={event.id} className="min-h-0 h-full">
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteContainer>
  );
}
