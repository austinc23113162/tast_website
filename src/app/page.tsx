import Link from "next/link";

import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <SiteContainer
      id="main-content"
      className="flex flex-col justify-center py-16 sm:py-24"
    >
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
    </SiteContainer>
  );
}
