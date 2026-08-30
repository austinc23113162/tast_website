import assert from "node:assert/strict";
import { test } from "node:test";

import {
  eventEffectiveEnd,
  formatEventRange,
  isUpcomingEvent,
  partitionEventsByTime,
} from "./datetime.ts";

const now = new Date("2026-08-30T17:00:00.000Z");

test("eventEffectiveEnd uses end_time when present, otherwise start_time", () => {
  assert.equal(
    eventEffectiveEnd({
      start_time: "2026-09-01T22:00:00.000Z",
      end_time: "2026-09-02T01:00:00.000Z",
    }).toISOString(),
    "2026-09-02T01:00:00.000Z"
  );
  assert.equal(
    eventEffectiveEnd({
      start_time: "2026-09-01T22:00:00.000Z",
      end_time: null,
    }).toISOString(),
    "2026-09-01T22:00:00.000Z"
  );
});

test("isUpcomingEvent treats events that have not ended as upcoming", () => {
  assert.equal(
    isUpcomingEvent(
      {
        start_time: "2026-08-30T16:00:00.000Z",
        end_time: "2026-08-30T18:00:00.000Z",
      },
      now
    ),
    true
  );
  assert.equal(
    isUpcomingEvent(
      {
        start_time: "2026-08-29T22:00:00.000Z",
        end_time: "2026-08-30T01:00:00.000Z",
      },
      now
    ),
    false
  );
  assert.equal(
    isUpcomingEvent(
      {
        start_time: "2026-08-30T16:00:00.000Z",
        end_time: null,
      },
      now
    ),
    false
  );
});

test("partitionEventsByTime splits on end time and sorts lists", () => {
  const laterUpcoming = {
    id: "later",
    start_time: "2026-10-01T22:00:00.000Z",
    end_time: "2026-10-02T01:00:00.000Z",
  };
  const soonerUpcoming = {
    id: "sooner",
    start_time: "2026-09-10T22:00:00.000Z",
    end_time: "2026-09-11T01:00:00.000Z",
  };
  const olderPast = {
    id: "older",
    start_time: "2026-02-15T23:00:00.000Z",
    end_time: "2026-02-16T02:00:00.000Z",
  };
  const recentPast = {
    id: "recent",
    start_time: "2026-08-20T22:00:00.000Z",
    end_time: "2026-08-21T01:00:00.000Z",
  };

  const { upcoming, past } = partitionEventsByTime(
    [laterUpcoming, olderPast, soonerUpcoming, recentPast],
    now
  );

  assert.deepEqual(
    upcoming.map((event) => event.id),
    ["sooner", "later"]
  );
  assert.deepEqual(
    past.map((event) => event.id),
    ["recent", "older"]
  );
});

test("formatEventRange collapses same-day start and end times", () => {
  const sameDay = formatEventRange(
    "2026-09-18T22:00:00.000Z",
    "2026-09-19T00:30:00.000Z"
  );
  assert.match(sameDay, /Sep 18, 2026/);
  assert.match(sameDay, /–/);
  assert.equal(sameDay.includes("Sep 18, 2026") && !sameDay.includes("Sep 19"), true);

  const multiDay = formatEventRange(
    "2026-09-18T22:00:00.000Z",
    "2026-09-20T01:00:00.000Z"
  );
  assert.match(multiDay, /Sep 18/);
  assert.match(multiDay, /Sep 19|Sep 20/);
});
