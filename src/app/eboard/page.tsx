import type { Metadata } from "next";

import { EboardMemberCard } from "@/components/eboard/eboard-member-card";
import { EmptyState } from "@/components/layout/empty-state";
import { PageShell } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { listEboardMembers } from "@/lib/db/eboard";

export const metadata: Metadata = {
  title: "E-Board",
};

export default async function EboardPage() {
  const members = await listEboardMembers();

  return (
    <PageShell
      title="E-Board"
      description="Meet the students who organize TAST this year."
    >
      {members.length === 0 ? (
        <EmptyState
          title="E-Board profiles coming soon"
          description="E-Board bios and roles will be listed here in a later update."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {members.map((member, index) => (
            <li key={member.id} className="h-full min-h-0">
              <Reveal className="h-full" delayMs={index * 60}>
                <EboardMemberCard member={member} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
