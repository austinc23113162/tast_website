import { storagePathFromPublicUrl } from "@/lib/db/photo-path";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export async function listEventPhotos(
  eventId: string
): Promise<Tables<"event_photos">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_photos")
    .select("id, event_id, image_url, caption, uploaded_by, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Could not load event photos.");
  }

  return data ?? [];
}

export async function uploadEventPhoto(values: {
  eventId: string;
  file: File;
  uploadedBy: string;
}): Promise<void> {
  const supabase = await createClient();
  const extension = extensionForMime(values.file.type);
  const path = `${values.eventId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("event-photos")
    .upload(path, values.file, {
      contentType: values.file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error("Could not upload the photo.");
  }

  const { data: publicUrl } = supabase.storage
    .from("event-photos")
    .getPublicUrl(path);

  const { error: insertError } = await supabase.from("event_photos").insert({
    event_id: values.eventId,
    image_url: publicUrl.publicUrl,
    caption: null,
    uploaded_by: values.uploadedBy,
  });

  if (insertError) {
    await supabase.storage.from("event-photos").remove([path]);
    throw new Error("Could not save the photo.");
  }
}

export async function deleteEventPhoto(photo: Tables<"event_photos">): Promise<void> {
  const supabase = await createClient();
  const path = storagePathFromPublicUrl(photo.image_url);

  const { error } = await supabase
    .from("event_photos")
    .delete()
    .eq("id", photo.id);

  if (error) {
    throw new Error("Could not delete the photo.");
  }

  if (path) {
    const { error: storageError } = await supabase.storage
      .from("event-photos")
      .remove([path]);
    if (storageError) {
      throw new Error("Could not remove the photo file.");
    }
  }
}

function extensionForMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}
