import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { SiteContainer } from "@/components/layout/site-container";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <SiteContainer id="main-content">
      <PageHeader
        title="About TAST"
        description="The Taiwanese Association of Students at Tufts is a student organization for Taiwanese students and anyone curious about Taiwanese culture."
      />
      <div className="mt-10 max-w-2xl space-y-6 text-base leading-relaxed text-muted-foreground">
        <p>
          We host dinners, cultural nights, study breaks, and collaborations with
          other groups on campus. Events are open to Tufts students whether or
          not you have a personal connection to Taiwan.
        </p>
        <p>
          TAST is student-run. The E-Board plans the calendar, works with TCU
          funding, and keeps the community informed. If you want to help, come
          to a general meeting or{" "}
          <Link href="/contact" className="text-foreground underline-offset-4 hover:underline">
            reach out
          </Link>
          .
        </p>
        <p>
          This page is starter copy. The E-Board can replace it with a fuller
          history and mission when they are ready.
        </p>
      </div>
    </SiteContainer>
  );
}
