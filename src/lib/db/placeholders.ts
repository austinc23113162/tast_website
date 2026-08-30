import type { PublicEboardMember } from "@/types";
import type { Tables } from "@/types/database";

export const placeholderAnnouncements: Tables<"announcements">[] = [
  {
    id: "ann-welcome-fall-2026",
    title: "Welcome back — Fall 2026",
    content:
      "Hello from TAST! Whether you are new to Tufts or returning, come say hi at our welcome mixer and join the group chat. More events will be posted as the semester settles.",
    created_by: null,
    created_at: "2026-08-25T14:00:00.000Z",
    updated_at: "2026-08-25T14:00:00.000Z",
  },
  {
    id: "ann-night-market",
    title: "Night Market volunteers needed",
    content:
      "We are planning a campus night market with food, games, and student vendors. If you want to help with setup, cooking, or outreach, email the E-Board — no experience required. We are planning a campus night market with food, games, and student vendors. If you want to help with setup, cooking, or outreach, email the E-Board — no experience required.",
    created_by: null,
    created_at: "2026-08-22T18:30:00.000Z",
    updated_at: "2026-08-22T18:30:00.000Z",
  },
  {
    id: "ann-mid-autumn",
    title: "Mid-Autumn mooncakes on the quad",
    content:
      "We will share mooncakes and tea the week of the Mid-Autumn Festival. Bring a friend. Exact time and lawn location are on the events page.",
    created_by: null,
    created_at: "2026-08-18T12:00:00.000Z",
    updated_at: "2026-08-18T12:00:00.000Z",
  },
];

export const placeholderEvents: Tables<"events">[] = [
  {
    id: "evt-welcome-mixer-2026",
    title: "Fall welcome mixer",
    description:
      "Meet other Taiwanese students and friends over snacks in the Campus Center. Come for 15 minutes or stay the whole time — no RSVP required.",
    location: "Tufts Campus Center, 2nd floor lounge",
    start_time: "2026-08-20T22:00:00.000Z",
    end_time: "2026-08-21T00:00:00.000Z",
    registration_url: null,
    created_by: null,
    created_at: "2026-08-01T12:00:00.000Z",
  },
  {
    id: "evt-lunar-new-year-2026",
    title: "Lunar New Year dinner",
    description:
      "A family-style dinner, red envelopes for fun, and a short introduction to the Year of the Horse. Open to all Tufts students.",
    location: "Aidekman Arts Center atrium",
    start_time: "2026-02-15T23:00:00.000Z",
    end_time: "2026-02-16T02:00:00.000Z",
    registration_url: null,
    created_by: null,
    created_at: "2026-01-10T12:00:00.000Z",
  },
  {
    id: "evt-night-market-2026",
    title: "TAST Night Market",
    description:
      "Street-food-inspired snacks, student vendors, and games on the residential quad. This listing is sample content until the E-Board publishes the real calendar.",
    location: "Carmichael / residential quad",
    start_time: "2026-09-18T22:00:00.000Z",
    end_time: "2026-09-19T01:30:00.000Z",
    registration_url: "https://forms.gle/tast-placeholder",
    created_by: null,
    created_at: "2026-08-10T12:00:00.000Z",
  },
  {
    id: "evt-study-break-2026",
    title: "Boba study break ",
    description:
      "Take a midterms pause with drinks and board games. Drop in whenever — bring problem sets if you want company while you work.",
    location: "Tisch Library, Group Study 1",
    start_time: "2026-10-08T21:00:00.000Z",
    end_time: "2026-10-08T23:00:00.000Z",
    registration_url: null,
    created_by: null,
    created_at: "2026-08-12T12:00:00.000Z",
  },
  {
    id: "evt-gm-nov-2026",
    title: "November general meeting",
    description:
      "Quick updates from the E-Board, event brainstorming, and snacks. Hypothetical date for layout testing.",
    location: "Eaton Hall 202",
    start_time: "2026-11-02T23:00:00.000Z",
    end_time: null,
    registration_url: null,
    created_by: null,
    created_at: "2026-08-15T12:00:00.000Z",
  },
];

export const placeholderEboard: PublicEboardMember[] = [
  {
    id: "eboard-president",
    position: "President",
    bio: "Keeps the calendar moving and represents TAST with other student groups. Placeholder bio.",
    display_order: 1,
    academic_year: "2026–2027",
    full_name: "Alex Chen",
    major: "International Relations",
    class_year: 2027,
  },
  {
    id: "eboard-vp",
    position: "Vice President",
    bio: "Helps run meetings and partners with cultural orgs on campus. Placeholder bio.",
    display_order: 2,
    academic_year: "2026–2027",
    full_name: "Jordan Lin",
    major: "Computer Science",
    class_year: 2028,
  },
  {
    id: "eboard-treasurer",
    position: "Treasurer",
    bio: "Tracks TCU funding, reimbursements, and event budgets. Placeholder bio.",
    display_order: 3,
    academic_year: "2026–2027",
    full_name: "Sam Wu",
    major: "Economics",
    class_year: 2027,
  },
  {
    id: "eboard-events",
    position: "Events Chair",
    bio: "Plans mixers, cultural nights, and study breaks. Placeholder bio.",
    display_order: 4,
    academic_year: "2026–2027",
    full_name: "Riley Huang",
    major: "Biology",
    class_year: 2029,
  },
];
