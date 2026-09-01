import type { Metadata } from "next";
import Link from "next/link";

import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { deleteEboardMemberAction } from "@/lib/admin/actions";
import { listEboardMembers } from "@/lib/db/eboard";

export const metadata: Metadata = {
  title: "Admin E-Board",
};

export default async function AdminEboardPage() {
  const members = await listEboardMembers();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-foreground">E-Board</h2>
        <Button render={<Link href="/admin/eboard/new" />}>Add member</Button>
      </div>
      {members.length === 0 ? (
        <EmptyState
          title="No officers listed"
          description="Add a member who already has a TAST account."
        />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">
                  {member.full_name} · {member.position}
                </p>
                <p className="text-sm text-muted-foreground">
                  {member.academic_year}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  render={<Link href={`/admin/eboard/${member.id}/edit`} />}
                >
                  Edit
                </Button>
                <ConfirmDeleteButton
                  action={deleteEboardMemberAction.bind(null, member.id)}
                  label="Remove"
                  message={`Remove ${member.full_name} from the E-Board?`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
