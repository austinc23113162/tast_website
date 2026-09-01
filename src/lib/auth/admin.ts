import { redirect } from "next/navigation";

import { isAdmin } from "@/lib/auth/roles";
import { requireUserId } from "@/lib/auth/session";
import { getOwnProfile, type OwnProfile } from "@/lib/db/profiles";

export async function requireAdmin(
  nextPath = "/admin"
): Promise<OwnProfile> {
  await requireUserId(nextPath);
  const profile = await getOwnProfile();
  if (!profile || !isAdmin(profile.role)) {
    redirect("/");
  }
  return profile;
}
