import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";
import { requireUserId } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Your attendance",
};

export default async function AccountAttendancePage() {
  await requireUserId("/account/attendance");

  return (
    <PlaceholderPage
      eyebrow="Account"
      title="Your attendance"
      description="See which TAST events you have checked in to."
      emptyTitle="Attendance history coming soon"
      emptyDescription="Check-in lands in a later phase. Your profile is still available from Account."
    />
  );
}
