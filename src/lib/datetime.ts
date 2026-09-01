const TUFTS_TIME_ZONE = "America/New_York";

export type TimedEvent = {
  start_time: string;
  end_time: string | null;
};

export function eventEffectiveEnd(event: TimedEvent): Date {
  return new Date(event.end_time ?? event.start_time);
}

export function isUpcomingEvent(
  event: TimedEvent,
  now: Date = new Date()
): boolean {
  return eventEffectiveEnd(event).getTime() >= now.getTime();
}

export function partitionEventsByTime<T extends TimedEvent>(
  events: readonly T[],
  now: Date = new Date()
): { upcoming: T[]; past: T[] } {
  const upcoming: T[] = [];
  const past: T[] = [];

  for (const event of events) {
    if (isUpcomingEvent(event, now)) {
      upcoming.push(event);
    } else {
      past.push(event);
    }
  }

  upcoming.sort(compareStartAscending);
  past.sort(compareStartDescending);

  return { upcoming, past };
}

function compareStartAscending(a: TimedEvent, b: TimedEvent) {
  return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
}

function compareStartDescending(a: TimedEvent, b: TimedEvent) {
  return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
}

const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TUFTS_TIME_ZONE,
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const dateOnlyFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TUFTS_TIME_ZONE,
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeOnlyFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TUFTS_TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
});

const dayKeyFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TUFTS_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatEventDateTime(iso: string): string {
  return dateTimeFormat.format(new Date(iso));
}

export function formatAnnouncementDate(iso: string): string {
  return dateOnlyFormat.format(new Date(iso));
}

export function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function datetimeLocalToIso(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Enter a valid date and time.");
  }
  return date.toISOString();
}

export function formatEventRange(
  startIso: string,
  endIso: string | null
): string {
  const start = new Date(startIso);
  if (!endIso) {
    return dateTimeFormat.format(start);
  }

  const end = new Date(endIso);
  const sameDay = dayKeyFormat.format(start) === dayKeyFormat.format(end);

  if (sameDay) {
    return `${dateOnlyFormat.format(start)}, ${timeOnlyFormat.format(start)} – ${timeOnlyFormat.format(end)}`;
  }

  return `${dateTimeFormat.format(start)} – ${dateTimeFormat.format(end)}`;
}
