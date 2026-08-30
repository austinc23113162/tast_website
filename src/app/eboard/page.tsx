import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "E-Board",
};

export default function EboardPage() {
  return (
    <PlaceholderPage
      title="E-Board"
      description="Meet the students who organize TAST this year."
      emptyTitle="E-Board profiles coming soon"
      emptyDescription="E-Board bios and roles will be listed here in a later update."
    />
  );
}
