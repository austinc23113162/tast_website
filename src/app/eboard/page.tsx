import type { Metadata } from "next";

import { EboardMemberCard } from "@/components/eboard/eboard-member-card";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { SiteContainer } from "@/components/layout/site-container";
import { listEboardMembers } from "@/lib/db/eboard";

export const metadata: Metadata = {
  title: "E-Board",
};

export default async function EboardPage() {
  const members = await listEboardMembers();

  return (
    <SiteContainer id="main-content">
      <PageHeader
        title="E-Board"
        description="Meet the students who organize TAST this year. Names and bios below are placeholders until officers publish their profiles."
      />
      {members.length === 0 ? (
        <EmptyState
          title="E-Board profiles coming soon"
          description="E-Board bios and roles will be listed here in a later update."
        />
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {members.map((member) => (
            <li key={member.id} className="min-h-0 h-full">
              <EboardMemberCard member={member} />
            </li>
          ))}
        </ul>
      )}
    </SiteContainer>
  );
}
