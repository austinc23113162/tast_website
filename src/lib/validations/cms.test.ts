import assert from "node:assert/strict";
import { test } from "node:test";

import {
  announcementSchema,
  attendanceSchema,
  eboardSchema,
  eventSchema,
} from "./cms.ts";

test("eventSchema accepts a valid event and optional URL", () => {
  const result = eventSchema.safeParse({
    title: "Night Market",
    description: "Food and games",
    location: "The Quad",
    startTime: "2026-09-18T18:00",
    endTime: "2026-09-18T21:00",
    registrationUrl: "https://forms.gle/example",
  });
  assert.equal(result.success, true);
});

test("eventSchema rejects an end time before the start time", () => {
  const result = eventSchema.safeParse({
    title: "Night Market",
    description: "",
    location: "",
    startTime: "2026-09-18T21:00",
    endTime: "2026-09-18T18:00",
    registrationUrl: "",
  });
  assert.equal(result.success, false);
});

test("eventSchema rejects a non-http registration URL", () => {
  const result = eventSchema.safeParse({
    title: "Night Market",
    description: "",
    location: "",
    startTime: "2026-09-18T18:00",
    endTime: "",
    registrationUrl: "forms.gle/example",
  });
  assert.equal(result.success, false);
});

test("announcementSchema requires title and content", () => {
  assert.equal(
    announcementSchema.safeParse({ title: "  ", content: "Hello" }).success,
    false
  );
  assert.equal(
    announcementSchema.safeParse({
      title: "Welcome",
      content: "Hello from TAST.",
    }).success,
    true
  );
});

test("eboardSchema and attendanceSchema require emails", () => {
  assert.equal(
    eboardSchema.safeParse({
      email: "not-an-email",
      position: "President",
      bio: "",
      displayOrder: "1",
      academicYear: "2026–2027",
    }).success,
    false
  );
  assert.equal(
    attendanceSchema.safeParse({
      eventId: "11111111-1111-4111-8111-111111111111",
      email: "member@tufts.edu",
    }).success,
    true
  );
});
