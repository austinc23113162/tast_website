import type { Metadata } from "next";
import Link from "next/link";

import { ProfileForm } from "@/components/auth/profile-form";
import { PageShell } from "@/components/layout/page-hero";
import { requireUserId } from "@/lib/auth/session";
import { getOwnProfile } from "@/lib/db/profiles";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  await requireUserId("/account");
  const profile = await getOwnProfile();

  return (
    <PageShell
      title="Your profile"
      description="Update the name, class year, and major TAST has on file."
      eyebrow="Account"
    >
      {profile ? (
        <ProfileForm profile={profile} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Your profile could not be loaded. Contact the E-Board if this
          continues after you refresh.
        </p>
      )}
      <p className="mt-8 text-sm text-muted-foreground">
        Event check-in history will appear on{" "}
        <Link
          href="/account/attendance"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          attendance
        </Link>{" "}
        in a later phase.
      </p>
    </PageShell>
  );
}
