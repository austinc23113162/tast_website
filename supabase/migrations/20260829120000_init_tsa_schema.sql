-- TSA schema: profiles, events, attendance, eboard, photos, announcements.
-- Drops leftover public.users. Role lives on profiles, not user_metadata.

drop table if exists public.users cascade;

do $$
begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace where t.typname = 'app_role' and n.nspname = 'public') then
    create type public.app_role as enum ('member', 'officer', 'admin');
  end if;
end
$$;

grant usage on type public.app_role to anon, authenticated, service_role;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to postgres, anon, authenticated, service_role;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text,
  class_year integer,
  major text,
  role public.app_role not null default 'member',
  created_at timestamptz not null default now(),
  constraint profiles_class_year_range check (
    class_year is null or (class_year >= 2000 and class_year <= 2100)
  )
);

create unique index profiles_email_key on public.profiles (email)
  where email is not null and email <> '';

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  start_time timestamptz not null,
  end_time timestamptz,
  registration_url text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint events_end_after_start check (
    end_time is null or end_time >= start_time
  ),
  constraint events_registration_url_http check (
    registration_url is null
    or registration_url ~* '^https?://'
  )
);

create index events_start_time_idx on public.events (start_time);
create index events_end_time_idx on public.events (end_time);
create index events_created_by_idx on public.events (created_by);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create index attendance_event_id_idx on public.attendance (event_id);
create index attendance_user_id_idx on public.attendance (user_id);

-- major is stored on profiles, not duplicated here
create table public.eboard_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  position text not null,
  bio text,
  display_order integer not null default 0,
  academic_year text not null
);

create index eboard_members_display_order_idx on public.eboard_members (display_order);

create table public.event_photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  image_url text not null,
  caption text,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index event_photos_event_id_idx on public.event_photos (event_id);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index announcements_created_at_idx on public.announcements (created_at desc);

create or replace function private.user_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = (select auth.uid());
$$;

revoke all on function private.user_role() from public;
grant execute on function private.user_role() to anon, authenticated, service_role;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function private.handle_new_user();

create or replace function private.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set email = new.email
  where id = new.id;
  return new;
end;
$$;

revoke all on function private.sync_profile_email() from public;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function private.sync_profile_email();

create or replace function private.set_announcement_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists announcements_set_updated_at on public.announcements;
create trigger announcements_set_updated_at
  before update on public.announcements
  for each row
  execute function private.set_announcement_updated_at();

create or replace function public.set_profile_role(target_id uuid, new_role public.app_role)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select role from public.profiles where id = (select auth.uid())) is distinct from 'admin'::public.app_role then
    raise exception 'Only admins can change roles';
  end if;

  update public.profiles
  set role = new_role
  where id = target_id;

  if not found then
    raise exception 'Profile not found';
  end if;
end;
$$;

revoke all on function public.set_profile_role(uuid, public.app_role) from public;
grant execute on function public.set_profile_role(uuid, public.app_role) to authenticated;

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.attendance enable row level security;
alter table public.eboard_members enable row level security;
alter table public.event_photos enable row level security;
alter table public.announcements enable row level security;

-- profiles
create policy "E-Board profiles are publicly readable"
  on public.profiles
  for select
  to anon
  using (
    exists (
      select 1
      from public.eboard_members
      where eboard_members.user_id = profiles.id
    )
  );

create policy "Authenticated users can read profiles"
  on public.profiles
  for select
  to authenticated
  using (true);

create policy "Users can update their own profile fields"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- events
create policy "Events are publicly readable"
  on public.events
  for select
  to anon, authenticated
  using (true);

create policy "Officers and admins can insert events"
  on public.events
  for insert
  to authenticated
  with check (private.user_role() in ('officer', 'admin'));

create policy "Officers and admins can update events"
  on public.events
  for update
  to authenticated
  using (private.user_role() in ('officer', 'admin'))
  with check (private.user_role() in ('officer', 'admin'));

create policy "Officers and admins can delete events"
  on public.events
  for delete
  to authenticated
  using (private.user_role() in ('officer', 'admin'));

-- attendance
create policy "Users can read their own attendance"
  on public.attendance
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Officers and admins can read all attendance"
  on public.attendance
  for select
  to authenticated
  using (private.user_role() in ('officer', 'admin'));

create policy "Users can check themselves in"
  on public.attendance
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Officers and admins can insert attendance"
  on public.attendance
  for insert
  to authenticated
  with check (private.user_role() in ('officer', 'admin'));

create policy "Officers and admins can delete attendance"
  on public.attendance
  for delete
  to authenticated
  using (private.user_role() in ('officer', 'admin'));

-- eboard
create policy "E-Board is publicly readable"
  on public.eboard_members
  for select
  to anon, authenticated
  using (true);

create policy "Admins can insert eboard members"
  on public.eboard_members
  for insert
  to authenticated
  with check (private.user_role() = 'admin');

create policy "Admins can update eboard members"
  on public.eboard_members
  for update
  to authenticated
  using (private.user_role() = 'admin')
  with check (private.user_role() = 'admin');

create policy "Admins can delete eboard members"
  on public.eboard_members
  for delete
  to authenticated
  using (private.user_role() = 'admin');

-- event photos
create policy "Event photos are publicly readable"
  on public.event_photos
  for select
  to anon, authenticated
  using (true);

create policy "Officers and admins can insert event photos"
  on public.event_photos
  for insert
  to authenticated
  with check (private.user_role() in ('officer', 'admin'));

create policy "Officers and admins can update event photos"
  on public.event_photos
  for update
  to authenticated
  using (private.user_role() in ('officer', 'admin'))
  with check (private.user_role() in ('officer', 'admin'));

create policy "Officers and admins can delete event photos"
  on public.event_photos
  for delete
  to authenticated
  using (private.user_role() in ('officer', 'admin'));

-- announcements
create policy "Announcements are publicly readable"
  on public.announcements
  for select
  to anon, authenticated
  using (true);

create policy "Officers and admins can insert announcements"
  on public.announcements
  for insert
  to authenticated
  with check (private.user_role() in ('officer', 'admin'));

create policy "Officers and admins can update announcements"
  on public.announcements
  for update
  to authenticated
  using (private.user_role() in ('officer', 'admin'))
  with check (private.user_role() in ('officer', 'admin'));

create policy "Officers and admins can delete announcements"
  on public.announcements
  for delete
  to authenticated
  using (private.user_role() in ('officer', 'admin'));

revoke all on table public.profiles from anon, authenticated, public;
revoke all on table public.events from anon, authenticated, public;
revoke all on table public.attendance from anon, authenticated, public;
revoke all on table public.eboard_members from anon, authenticated, public;
revoke all on table public.event_photos from anon, authenticated, public;
revoke all on table public.announcements from anon, authenticated, public;

grant select (id, full_name, class_year, major) on table public.profiles to anon;
grant select on table public.profiles to authenticated, service_role;
grant update (full_name, class_year, major) on table public.profiles to authenticated;
grant all on table public.profiles to service_role;

grant select on table public.events to anon, authenticated, service_role;
grant insert, update, delete on table public.events to authenticated, service_role;

grant select, insert, delete on table public.attendance to authenticated, service_role;

grant select on table public.eboard_members to anon, authenticated, service_role;
grant insert, update, delete on table public.eboard_members to authenticated, service_role;

grant select on table public.event_photos to anon, authenticated, service_role;
grant insert, update, delete on table public.event_photos to authenticated, service_role;

grant select on table public.announcements to anon, authenticated, service_role;
grant insert, update, delete on table public.announcements to authenticated, service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-photos',
  'event-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read event-photos"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'event-photos');

create policy "Officers and admins can upload event-photos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'event-photos'
    and private.user_role() in ('officer', 'admin')
  );

create policy "Officers and admins can update event-photos"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'event-photos'
    and private.user_role() in ('officer', 'admin')
  )
  with check (
    bucket_id = 'event-photos'
    and private.user_role() in ('officer', 'admin')
  );

create policy "Officers and admins can delete event-photos"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'event-photos'
    and private.user_role() in ('officer', 'admin')
  );
