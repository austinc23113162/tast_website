import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Attendance",
};

export default function AttendancePage() {
  return (
    <PlaceholderPage
      title="Attendance"
      description="Track check-ins for TAST events."
      emptyTitle="Attendance tracker coming soon"
      emptyDescription="This page will show event attendance after check-in is enabled."
    />
  );
}
