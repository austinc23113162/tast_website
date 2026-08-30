import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { SiteContainer } from "@/components/layout/site-container";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <SiteContainer id="main-content">
      <PageHeader
        title="Contact"
        description="Reach the TAST E-Board with questions, collaborations, or ideas for events."
      />
      <dl className="mt-10 max-w-xl space-y-6 text-sm">
        <div>
          <dt className="font-medium text-foreground">Email</dt>
          <dd className="mt-1">
            <a
              href="mailto:tast@tufts.edu"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              tast@tufts.edu
            </a>
            <span className="ml-2 text-xs text-muted-foreground">
              (placeholder)
            </span>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Campus</dt>
          <dd className="mt-1 text-muted-foreground">
            Tufts University, Medford, MA
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Social</dt>
          <dd className="mt-1 text-muted-foreground">
            Instagram and Facebook links will be added when accounts are
            confirmed. Until then, use email or find TAST through Tufts student
            organization listings.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">E-Board</dt>
          <dd className="mt-1 text-muted-foreground">
            See current officers on the{" "}
            <Link href="/eboard" className="text-foreground underline-offset-4 hover:underline">
              E-Board page
            </Link>
            .
          </dd>
        </div>
      </dl>
    </SiteContainer>
  );
}
