import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value));

export const eventSchema = z
  .object({
    title: z.string().trim().min(1, "Enter a title.").max(200),
    description: optionalText,
    location: optionalText,
    startTime: z.string().min(1, "Enter a start time."),
    endTime: z.string().optional(),
    registrationUrl: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || /^https?:\/\//i.test(value),
        "Registration URL must start with http:// or https://."
      )
      .transform((value) => (value === "" ? null : value)),
  })
  .superRefine((value, ctx) => {
    const start = new Date(value.startTime);
    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        code: "custom",
        path: ["startTime"],
        message: "Enter a valid start time.",
      });
    }

    if (value.endTime && value.endTime !== "") {
      const end = new Date(value.endTime);
      if (Number.isNaN(end.getTime())) {
        ctx.addIssue({
          code: "custom",
          path: ["endTime"],
          message: "Enter a valid end time.",
        });
        return;
      }
      if (!Number.isNaN(start.getTime()) && end < start) {
        ctx.addIssue({
          code: "custom",
          path: ["endTime"],
          message: "End time must be at or after the start time.",
        });
      }
    }
  });

export const announcementSchema = z.object({
  title: z.string().trim().min(1, "Enter a title.").max(200),
  content: z.string().trim().min(1, "Enter announcement text.").max(8000),
});

export const eboardSchema = z.object({
  email: z.email("Enter the member's email."),
  position: z.string().trim().min(1, "Enter a position.").max(120),
  bio: optionalText,
  displayOrder: z.coerce.number().int().min(0).max(999),
  academicYear: z.string().trim().min(1, "Enter an academic year.").max(40),
});

export const eboardUpdateSchema = eboardSchema.omit({ email: true });

export const eventPhotoSchema = z.object({
  eventId: z.uuid(),
});

export const attendanceSchema = z.object({
  eventId: z.uuid(),
  email: z.email("Enter the member's email."),
});

export const EVENT_PHOTO_MAX_BYTES = 10 * 1024 * 1024;
export const EVENT_PHOTO_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type EventInput = z.infer<typeof eventSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
