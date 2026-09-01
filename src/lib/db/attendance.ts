import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type AttendanceRecord = Tables<"attendance"> & {
  full_name: string;
  email: string | null;
};

export async function findProfileIdByEmail(
  email: string
): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (error) {
    throw new Error("Could not look up that member.");
  }

  return data?.id ?? null;
}

export async function listAttendanceForEvent(
  eventId: string
): Promise<AttendanceRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attendance")
    .select(
      "id, event_id, user_id, checked_in_at, profiles ( full_name, email )"
    )
    .eq("event_id", eventId)
    .order("checked_in_at", { ascending: false });

  if (error) {
    throw new Error("Could not load attendance.");
  }

  return (data ?? []).map((row) => {
    const profile = Array.isArray(row.profiles)
      ? row.profiles[0]
      : row.profiles;
    return {
      id: row.id,
      event_id: row.event_id,
      user_id: row.user_id,
      checked_in_at: row.checked_in_at,
      full_name: profile?.full_name ?? "Unknown member",
      email: profile?.email ?? null,
    };
  });
}

export async function addAttendance(values: {
  eventId: string;
  userId: string;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("attendance").insert({
    event_id: values.eventId,
    user_id: values.userId,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("That member is already checked in.");
    }
    throw new Error("Could not add attendance.");
  }
}

export async function removeAttendance(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("attendance").delete().eq("id", id);

  if (error) {
    throw new Error("Could not remove attendance.");
  }
}
