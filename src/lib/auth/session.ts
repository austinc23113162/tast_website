import { redirect } from "next/navigation";

import { getSafeInternalPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

export async function getAuthUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || data?.claims == null) {
    return null;
  }

  const sub = data.claims.sub;
  return typeof sub === "string" && sub.length > 0 ? sub : null;
}

export async function requireUserId(nextPath = "/account"): Promise<string> {
  const userId = await getAuthUserId();
  if (userId) {
    return userId;
  }

  const next = getSafeInternalPath(nextPath);
  redirect(`/login?next=${encodeURIComponent(next)}`);
}
