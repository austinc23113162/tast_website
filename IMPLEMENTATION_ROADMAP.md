# TAST Website — Implementation Roadmap

Incremental plan. Complete one phase, then wait for the next instruction.

**Current repo status (2026-08-29):** Phase 2 complete. Public routes have a shared layout, TAST visual tokens, and empty-state placeholders. Content from the database lands in Phase 3.

---

## Phase 0 — Scaffold the Next.js app ✅

Initialize with the App Router, TypeScript, Tailwind, ESLint, and `src/` directory (or root `app/` — pick one and stay consistent; recommended: **`src/`**).

Then add shadcn/ui, Supabase clients, and env placeholders. Do **not** build pages beyond a minimal shell (root layout + placeholder home) in this phase.

### Commands used

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes --disable-git --no-agents-md
npx shadcn@latest init
npm install @supabase/supabase-js @supabase/ssr react-hook-form zod @hookform/resolvers
```

shadcn will pull Lucide React, `class-variance-authority`, `clsx`, and `tailwind-merge`. Do not add extra UI libraries.

**Defer until needed (explain before adding):**

- QR generation/scanning library (Phase 6)
- Date formatting library (only if native `Intl` is insufficient)

---

## Proposed folder structure

```text
src/
  app/
    layout.tsx
    page.tsx                          # home / announcements
    globals.css
    events/
      page.tsx                        # upcoming
      past/page.tsx
      [id]/page.tsx
    eboard/page.tsx
    about/page.tsx
    contact/page.tsx
    attendance/page.tsx               # public tracker (if kept public)
    login/page.tsx
    signup/page.tsx
    auth/callback/route.ts            # Supabase auth callback
    account/
      attendance/page.tsx             # member history
    check-in/[eventId]/page.tsx
    admin/
      page.tsx
      events/
      eboard/
      announcements/
      attendance/
  components/
    ui/                               # shadcn primitives
    layout/                           # header, footer, nav
    events/
    announcements/
    eboard/
  lib/
    supabase/
      client.ts                       # browser client
      server.ts                       # server component / route client
      admin.ts                        # service role, server-only if ever required
    db/                               # all table access lives here
      profiles.ts
      events.ts
      attendance.ts
      announcements.ts
      eboard.ts
      photos.ts
    validations/                      # Zod schemas
    auth/
      roles.ts                        # member | admin helpers
  types/
    database.ts                       # generated Supabase types
    index.ts
  middleware.ts                       # session refresh + route protection
supabase/
  migrations/                         # source of truth for schema
  config.toml                         # after `supabase init` (optional local stack)
public/
.env.local                            # gitignored
.env.example
```

Keep data fetching in `lib/db/*`. Pages and components should not scatter `supabase.from(...)` calls.

---

## Packages

| Package | Why |
| --- | --- |
| `next`, `react`, `react-dom` | App Router UI |
| `typescript` | Types |
| `tailwindcss` | Styling |
| shadcn/ui (+ Radix primitives it installs) | Accessible UI kit |
| `lucide-react` | Icons (via shadcn) |
| `@supabase/supabase-js` | Auth, Postgres, Storage |
| `@supabase/ssr` | Cookie session for App Router |
| `react-hook-form` | Forms |
| `zod` | Validation |
| `@hookform/resolvers` | Wire Zod to RHF |

**Never install in the client bundle:** anything that needs the service-role key.

---

## Environment variables

| Variable | Where it is used | Public? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server Supabase clients | Yes (project URL) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser + server (or legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`) | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only, only if RLS cannot do the job | **No** — never `NEXT_PUBLIC_` |

Prefer publishable/anon keys and RLS over the service role. If a service-role client is required later, import it only from Server Actions, Route Handlers, or other server modules.

Do not commit `.env.local`. Put names only in `.env.example`.

---

## Recommended architecture

### Rendering

- Default to **Server Components** for pages that read public or session-scoped data.
- Use **Client Components** only for interactivity (nav, forms, check-in scanner, admin editors).
- Use **Route Handlers** for the auth callback and any webhook-style endpoints.
- Use **Server Actions** (or Route Handlers) for mutations so validation stays on the server.

### Auth

- Supabase Auth (email/password first; campus SSO can wait).
- `@supabase/ssr` browser + server clients with cookies.
- Next.js `middleware` refreshes the session and gates `/admin/*` and member-only routes.
- On signup, a **database trigger** creates `public.profiles` (`id` = `auth.users.id`). Never trust `user_metadata` for roles.

### Roles

Store `role` on `profiles` as `'member' | 'admin'`, default `'member'`. E-Board shares one admin account.

- Members cannot update their own `role` (RLS).
- Only admins can promote users (via `private.set_profile_role`).
- Authorization in RLS reads `profiles.role` (through `private.user_role()`), not JWT `user_metadata`.

| Capability | member | admin |
| --- | --- | --- |
| RSVP via Google Form link | yes | yes |
| Check in / view own attendance | yes | yes |
| Create/edit events, announcements, photos, attendance | no | yes |
| Manage E-Board and roles | no | yes |

### Data and security

- Foreign keys: `profiles.id → auth.users.id`; `events.created_by`, `attendance.user_id`, `eboard_members.user_id`, `event_photos.uploaded_by`, `announcements.created_by` → `profiles.id`; photo/attendance `event_id` → `events.id`.
- Unique `(event_id, user_id)` on `attendance`.
- RLS on every table in `public`. Public read for published events, announcements, E-Board, and photos; writes restricted by role.
- After creating tables, **GRANT** `anon`/`authenticated` as needed and enable RLS. New tables are not always exposed to the Data API automatically.
- Storage: private or public `event-photos` bucket with policies matching `event_photos` rows. Store `image_url` (or storage path) in Postgres; do not put binaries in the database.
- RSVP is **not** stored as a first-class RSVP table in v1: `registration_url` opens a Google Form.

### Types and validation

- Generate TypeScript types from Supabase (`database.ts`).
- Zod schemas for admin/member forms; re-validate in Server Actions.
- No `any` in app code.

### Design

- Shared layout: header, footer, skip link, mobile nav.
- Palette: Tufts-adjacent navy + off-white, with restrained Taiwan-inspired accent (e.g. plum/red used sparingly).
- Responsive from the first public pages. Prefer shadcn primitives for accessibility.

---

## Implementation phases

### Phase 1 — Database foundation ✅

- `supabase init` (optional local) or remote migrations via CLI.
- Drop or ignore leftover `public.users`.
- Create `profiles` (including `role`), `events`, `attendance`, `eboard_members`, `event_photos`, `announcements`.
- FKs, unique attendance constraint, indexes on time/FKs.
- Signup trigger → profile.
- RLS policies + Data API grants.
- Storage bucket for event photos.
- Generate TypeScript types.

### Phase 2 — App shell + design system ✅

- Next.js + Tailwind + shadcn init.
- Root layout, typography, colors, Header/Footer.
- Placeholder routes for public pages (empty states OK).

### Phase 3 — Public content (read-only)

- Home with latest announcements.
- Upcoming / past events (split on `end_time` vs now).
- Event detail (description, location, times, RSVP button if `registration_url` is set).
- About, Contact, E-Board (from `eboard_members` + profiles).
- Loading, error, and empty states.

### Phase 4 — Auth ✅

- Sign up / login / logout / session callback.
- Protected member routes.
- Profile fields: full name, class year, major.

### Phase 5 — Admin CMS

- Admin dashboard.
- CRUD events, announcements, E-Board.
- Photo upload to Storage + `event_photos` rows.
- Attendance management (manual add/remove if needed).

### Phase 6 — Attendance + check-in

- Public or member attendance tracker (confirm audience).
- QR check-in (library decision at this phase).
- Member attendance history.

### Phase 7 — Polish

- Imagery, motion, SEO metadata, accessibility pass, production env check.

---

## Out of scope until requested

- Full page implementation in this pass
- Deploy (Vercel or otherwise)
- Custom domain / Tufts email allowlist
- QR library choice

## Database schema (as implemented)

### profiles
* id UUID (PK, `auth.users.id`)
* full_name
* email
* class_year
* major
* role (`member` | `admin`, default `member`)
* created_at

### events
* id UUID
* title
* description
* location
* start_time
* end_time
* registration_url
* created_by
* created_at

### attendance
* id UUID
* event_id
* user_id
* checked_in_at
* unique (event_id, user_id)

### eboard_members
* id UUID
* user_id (unique)
* position
* bio
* display_order
* academic_year

Major lives on `profiles`, not on this table.

### event_photos
* id UUID
* event_id
* image_url
* caption
* uploaded_by
* created_at

### announcements
* id UUID
* title
* content
* created_by
* created_at
* updated_at
