import Link from "next/link";

import { AnnouncementList } from "@/components/announcements/announcement-list";
import { EventCard } from "@/components/events/event-card";
import { HomeBanner } from "@/components/layout/home-banner";
import { Reveal } from "@/components/motion/reveal";
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
    <main id="main-content" className="flex-1">
      <HomeBanner>
        <Reveal>
          <p className="text-sm font-medium tracking-wide text-accent uppercase">
            Tufts University
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-primary-foreground sm:text-5xl">
            Taiwanese Association of Students at Tufts
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/85">
            A home for Taiwanese students and friends at Tufts. Browse upcoming
            gatherings, meet the E-Board, and stay in the loop.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              render={<Link href="/events" />}
            >
              Upcoming events
            </Button>
            <Button
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              render={<Link href="/about" />}
            >
              About TAST
            </Button>
          </div>
        </Reveal>
      </HomeBanner>
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Reveal>
          <section aria-labelledby="announcements-heading">
            <h2
              id="announcements-heading"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Latest announcements
            </h2>
            <AnnouncementList announcements={announcements} />
          </section>
        </Reveal>

        <Reveal className="mt-16">
          <section aria-labelledby="upcoming-heading">
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
                  <li key={event.id} className="h-full min-h-0">
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </Reveal>
      </div>
    </main>
  );
}
