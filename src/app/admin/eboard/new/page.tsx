import type { Metadata } from "next";

import { EboardForm } from "@/components/admin/eboard-form";

export const metadata: Metadata = {
  title: "Add E-Board member",
};

export default function NewEboardMemberPage() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-foreground">
        Add E-Board member
      </h2>
      <EboardForm />
    </div>
  );
}
