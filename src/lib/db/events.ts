import { partitionEventsByTime } from "@/lib/datetime";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export async function listEvents(): Promise<Tables<"events">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, title, description, location, start_time, end_time, registration_url, created_by, created_at"
    )
    .order("start_time", { ascending: true });

  if (error) {
    throw new Error("Could not load events.");
  }

  return data ?? [];
}

export async function listUpcomingEvents(
  now: Date = new Date()
): Promise<Tables<"events">[]> {
  const { upcoming } = partitionEventsByTime(await listEvents(), now);
  return upcoming;
}

export async function listPastEvents(
  now: Date = new Date()
): Promise<Tables<"events">[]> {
  const { past } = partitionEventsByTime(await listEvents(), now);
  return past;
}

export async function getEventById(
  id: string
): Promise<Tables<"events"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, title, description, location, start_time, end_time, registration_url, created_by, created_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load this event.");
  }

  return data;
}

export async function createEvent(values: {
  title: string;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string | null;
  registrationUrl: string | null;
  createdBy: string;
}): Promise<Tables<"events">> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .insert({
      title: values.title,
      description: values.description,
      location: values.location,
      start_time: values.startTime,
      end_time: values.endTime,
      registration_url: values.registrationUrl,
      created_by: values.createdBy,
    })
    .select(
      "id, title, description, location, start_time, end_time, registration_url, created_by, created_at"
    )
    .single();

  if (error || !data) {
    throw new Error("Could not create the event.");
  }

  return data;
}

export async function updateEvent(
  id: string,
  values: {
    title: string;
    description: string | null;
    location: string | null;
    startTime: string;
    endTime: string | null;
    registrationUrl: string | null;
  }
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("events")
    .update({
      title: values.title,
      description: values.description,
      location: values.location,
      start_time: values.startTime,
      end_time: values.endTime,
      registration_url: values.registrationUrl,
    })
    .eq("id", id);

  if (error) {
    throw new Error("Could not update the event.");
  }
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: files } = await supabase.storage.from("event-photos").list(id);
  if (files && files.length > 0) {
    await supabase.storage
      .from("event-photos")
      .remove(files.map((file) => `${id}/${file.name}`));
  }

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    throw new Error("Could not delete the event.");
  }
}
