import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export async function listAnnouncements(): Promise<Tables<"announcements">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("id, title, content, created_by, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Could not load announcements.");
  }

  return data ?? [];
}

export async function listLatestAnnouncements(
  limit = 3
): Promise<Tables<"announcements">[]> {
  const announcements = await listAnnouncements();
  return announcements.slice(0, limit);
}

export async function getAnnouncementById(
  id: string
): Promise<Tables<"announcements"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("id, title, content, created_by, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load this announcement.");
  }

  return data;
}

export async function createAnnouncement(values: {
  title: string;
  content: string;
  createdBy: string;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").insert({
    title: values.title,
    content: values.content,
    created_by: values.createdBy,
  });

  if (error) {
    throw new Error("Could not create the announcement.");
  }
}

export async function updateAnnouncement(
  id: string,
  values: { title: string; content: string }
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("announcements")
    .update({
      title: values.title,
      content: values.content,
    })
    .eq("id", id);

  if (error) {
    throw new Error("Could not update the announcement.");
  }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);

  if (error) {
    throw new Error("Could not delete the announcement.");
  }
}
