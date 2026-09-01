"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/admin";
import { datetimeLocalToIso } from "@/lib/datetime";
import {
  addAttendance,
  findProfileIdByEmail,
  removeAttendance,
} from "@/lib/db/attendance";
import {
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
} from "@/lib/db/announcements";
import {
  createEboardMember,
  deleteEboardMember,
  updateEboardMember,
} from "@/lib/db/eboard";
import {
  createEvent,
  deleteEvent,
  updateEvent,
} from "@/lib/db/events";
import { deleteEventPhoto, uploadEventPhoto } from "@/lib/db/photos";
import {
  EVENT_PHOTO_MAX_BYTES,
  EVENT_PHOTO_MIME_TYPES,
  announcementSchema,
  attendanceSchema,
  eboardSchema,
  eboardUpdateSchema,
  eventPhotoSchema,
  eventSchema,
} from "@/lib/validations/cms";
import type { Tables } from "@/types/database";

export type AdminFormState = {
  error?: string;
};

function firstZodMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Check the form and try again.";
}

function revalidateEventPages(eventId?: string) {
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/events/past");
  revalidatePath("/admin/events");
  revalidatePath("/admin/attendance");
  if (eventId) {
    revalidatePath(`/events/${eventId}`);
    revalidatePath(`/admin/events/${eventId}/edit`);
    revalidatePath(`/admin/events/${eventId}/photos`);
    revalidatePath(`/admin/events/${eventId}/attendance`);
  }
}

export async function createEventAction(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    location: formData.get("location") ?? "",
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime") ?? "",
    registrationUrl: formData.get("registrationUrl") ?? "",
  });

  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  let event;
  try {
    event = await createEvent({
      title: parsed.data.title,
      description: parsed.data.description,
      location: parsed.data.location,
      startTime: datetimeLocalToIso(parsed.data.startTime),
      endTime:
        parsed.data.endTime && parsed.data.endTime !== ""
          ? datetimeLocalToIso(parsed.data.endTime)
          : null,
      registrationUrl: parsed.data.registrationUrl,
      createdBy: admin.id,
    });
  } catch (cause) {
    return {
      error:
        cause instanceof Error ? cause.message : "Could not create the event.",
    };
  }

  revalidateEventPages(event.id);
  redirect("/admin/events");
}

export async function updateEventAction(
  eventId: string,
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    location: formData.get("location") ?? "",
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime") ?? "",
    registrationUrl: formData.get("registrationUrl") ?? "",
  });

  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  try {
    await updateEvent(eventId, {
      title: parsed.data.title,
      description: parsed.data.description,
      location: parsed.data.location,
      startTime: datetimeLocalToIso(parsed.data.startTime),
      endTime:
        parsed.data.endTime && parsed.data.endTime !== ""
          ? datetimeLocalToIso(parsed.data.endTime)
          : null,
      registrationUrl: parsed.data.registrationUrl,
    });
  } catch (cause) {
    return {
      error:
        cause instanceof Error ? cause.message : "Could not update the event.",
    };
  }

  revalidateEventPages(eventId);
  return {};
}

export async function deleteEventAction(eventId: string) {
  await requireAdmin();
  try {
    await deleteEvent(eventId);
  } catch (cause) {
    throw cause instanceof Error
      ? cause
      : new Error("Could not delete the event.");
  }
  revalidateEventPages(eventId);
  redirect("/admin/events");
}

export async function createAnnouncementAction(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const parsed = announcementSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  try {
    await createAnnouncement({
      title: parsed.data.title,
      content: parsed.data.content,
      createdBy: admin.id,
    });
  } catch (cause) {
    return {
      error:
        cause instanceof Error
          ? cause.message
          : "Could not create the announcement.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/announcements");
  redirect("/admin/announcements");
}

export async function updateAnnouncementAction(
  announcementId: string,
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = announcementSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  try {
    await updateAnnouncement(announcementId, parsed.data);
  } catch (cause) {
    return {
      error:
        cause instanceof Error
          ? cause.message
          : "Could not update the announcement.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/announcements");
  return {};
}

export async function deleteAnnouncementAction(announcementId: string) {
  await requireAdmin();
  await deleteAnnouncement(announcementId);
  revalidatePath("/");
  revalidatePath("/admin/announcements");
  redirect("/admin/announcements");
}

export async function createEboardMemberAction(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = eboardSchema.safeParse({
    email: formData.get("email"),
    position: formData.get("position"),
    bio: formData.get("bio") ?? "",
    displayOrder: formData.get("displayOrder"),
    academicYear: formData.get("academicYear"),
  });

  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  try {
    const userId = await findProfileIdByEmail(parsed.data.email);
    if (!userId) {
      return { error: "No member account uses that email." };
    }
    await createEboardMember({
      userId,
      position: parsed.data.position,
      bio: parsed.data.bio,
      displayOrder: parsed.data.displayOrder,
      academicYear: parsed.data.academicYear,
    });
  } catch (cause) {
    return {
      error:
        cause instanceof Error
          ? cause.message
          : "Could not add the E-Board member.",
    };
  }

  revalidatePath("/eboard");
  revalidatePath("/admin/eboard");
  redirect("/admin/eboard");
}

export async function updateEboardMemberAction(
  memberId: string,
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = eboardUpdateSchema.safeParse({
    position: formData.get("position"),
    bio: formData.get("bio") ?? "",
    displayOrder: formData.get("displayOrder"),
    academicYear: formData.get("academicYear"),
  });

  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  try {
    await updateEboardMember(memberId, {
      position: parsed.data.position,
      bio: parsed.data.bio,
      displayOrder: parsed.data.displayOrder,
      academicYear: parsed.data.academicYear,
    });
  } catch (cause) {
    return {
      error:
        cause instanceof Error
          ? cause.message
          : "Could not update the E-Board member.",
    };
  }

  revalidatePath("/eboard");
  revalidatePath("/admin/eboard");
  return {};
}

export async function deleteEboardMemberAction(memberId: string) {
  await requireAdmin();
  await deleteEboardMember(memberId);
  revalidatePath("/eboard");
  revalidatePath("/admin/eboard");
  redirect("/admin/eboard");
}

export async function uploadEventPhotoAction(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const parsed = eventPhotoSchema.safeParse({
    eventId: formData.get("eventId"),
  });

  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a photo to upload." };
  }
  if (file.size > EVENT_PHOTO_MAX_BYTES) {
    return { error: "Photos must be 10 MB or smaller." };
  }
  if (
    !EVENT_PHOTO_MIME_TYPES.includes(
      file.type as (typeof EVENT_PHOTO_MIME_TYPES)[number]
    )
  ) {
    return { error: "Use a JPEG, PNG, WebP, or GIF image." };
  }

  try {
    await uploadEventPhoto({
      eventId: parsed.data.eventId,
      file,
      uploadedBy: admin.id,
    });
  } catch (cause) {
    return {
      error:
        cause instanceof Error ? cause.message : "Could not upload the photo.",
    };
  }

  revalidateEventPages(parsed.data.eventId);
  return {};
}

export async function deleteEventPhotoAction(photo: Tables<"event_photos">) {
  await requireAdmin();
  await deleteEventPhoto(photo);
  revalidateEventPages(photo.event_id);
}

export async function addAttendanceAction(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = attendanceSchema.safeParse({
    eventId: formData.get("eventId"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  try {
    const userId = await findProfileIdByEmail(parsed.data.email);
    if (!userId) {
      return { error: "No member account uses that email." };
    }
    await addAttendance({ eventId: parsed.data.eventId, userId });
  } catch (cause) {
    return {
      error:
        cause instanceof Error ? cause.message : "Could not add attendance.",
    };
  }

  revalidateEventPages(parsed.data.eventId);
  return {};
}

export async function removeAttendanceAction(attendanceId: string, eventId: string) {
  await requireAdmin();
  await removeAttendance(attendanceId);
  revalidateEventPages(eventId);
}
