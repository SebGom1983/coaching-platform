// Builds a standard .ics calendar file from a list of classes.
// This is plain text generation — no external service, no cost.

export type IcsEvent = {
  id: string;
  title: string;
  startsAt: string; // ISO datetime, e.g. "2026-08-20T15:00:00"
  durationMinutes: number;
  description?: string;
  location?: string; // e.g. the Teams link
};

function toIcsDate(iso: string): string {
  // ICS wants UTC times in the form YYYYMMDDTHHMMSSZ
  const d = new Date(iso);
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildIcsCalendar(calendarName: string, events: IcsEvent[]): string {
  const now = toIcsDate(new Date().toISOString());

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Seb Coaching//Class Schedule//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(calendarName)}`,
    "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
    "X-PUBLISHED-TTL:PT1H",
  ];

  for (const ev of events) {
    const start = toIcsDate(ev.startsAt);
    const endDate = new Date(new Date(ev.startsAt).getTime() + ev.durationMinutes * 60000);
    const end = toIcsDate(endDate.toISOString());

    lines.push(
      "BEGIN:VEVENT",
      `UID:${ev.id}@coaching-platform`,
      `DTSTAMP:${now}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${escapeText(ev.title)}`
    );
    if (ev.description) lines.push(`DESCRIPTION:${escapeText(ev.description)}`);
    if (ev.location) lines.push(`LOCATION:${escapeText(ev.location)}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
