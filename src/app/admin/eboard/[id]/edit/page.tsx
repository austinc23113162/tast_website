import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EboardForm } from "@/components/admin/eboard-form";
import { getEboardMemberById } from "@/lib/db/eboard";

type EditEboardPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditEboardPageProps): Promise<Metadata> {
  const { id } = await params;
  const member = await getEboardMemberById(id);
  return { title: member ? `Edit ${member.position}` : "E-Board member not found" };
}

export default async function EditEboardMemberPage({
  params,
}: EditEboardPageProps) {
  const { id } = await params;
  const member = await getEboardMemberById(id);
  if (!member) {
    notFound();
  }

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-foreground">
        Edit E-Board member
      </h2>
      <EboardForm member={member} />
    </div>
  );
}
