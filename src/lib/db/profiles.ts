import { getAuthUserId } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type OwnProfile = Pick<
  Tables<"profiles">,
  "id" | "full_name" | "email" | "class_year" | "major" | "role"
>;

export async function getOwnProfile(): Promise<OwnProfile | null> {
  const userId = await getAuthUserId();
  if (!userId) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, class_year, major, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load your profile.");
  }

  return data;
}

export async function updateOwnProfile(values: {
  fullName: string;
  classYear: number | null;
  major: string | null;
}): Promise<void> {
  const userId = await getAuthUserId();
  if (!userId) {
    throw new Error("You must be signed in to update your profile.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: values.fullName,
      class_year: values.classYear,
      major: values.major,
    })
    .eq("id", userId);

  if (error) {
    throw new Error("Could not save your profile.");
  }
}
