-- Collapse roles to member | admin. Shared E-Board login uses the admin role.

drop policy if exists "Officers and admins can insert events" on public.events;
drop policy if exists "Officers and admins can update events" on public.events;
drop policy if exists "Officers and admins can delete events" on public.events;
drop policy if exists "Users and staff can read attendance" on public.attendance;
drop policy if exists "Users and staff can insert attendance" on public.attendance;
drop policy if exists "Officers and admins can delete attendance" on public.attendance;
drop policy if exists "Officers and admins can insert event photos" on public.event_photos;
drop policy if exists "Officers and admins can update event photos" on public.event_photos;
drop policy if exists "Officers and admins can delete event photos" on public.event_photos;
drop policy if exists "Officers and admins can insert announcements" on public.announcements;
drop policy if exists "Officers and admins can update announcements" on public.announcements;
drop policy if exists "Officers and admins can delete announcements" on public.announcements;
drop policy if exists "Officers and admins can upload event-photos" on storage.objects;
drop policy if exists "Officers and admins can update event-photos" on storage.objects;
drop policy if exists "Officers and admins can delete event-photos" on storage.objects;
drop policy if exists "Admins can insert eboard members" on public.eboard_members;
drop policy if exists "Admins can update eboard members" on public.eboard_members;
drop policy if exists "Admins can delete eboard members" on public.eboard_members;

drop function if exists private.user_role() cascade;
drop function if exists private.set_profile_role(uuid, public.app_role) cascade;

update public.profiles
set role = 'admin'
where role::text = 'officer';

alter table public.profiles alter column role drop default;

create type public.app_role_new as enum ('member', 'admin');

alter table public.profiles
  alter column role type public.app_role_new
  using (
    case
      when role::text = 'officer' then 'admin'::public.app_role_new
      else role::text::public.app_role_new
    end
  );

drop type public.app_role;
alter type public.app_role_new rename to app_role;

alter table public.profiles
  alter column role set default 'member'::public.app_role;

grant usage on type public.app_role to anon, authenticated, service_role;

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

create or replace function private.set_profile_role(target_id uuid, new_role public.app_role)
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

revoke all on function private.set_profile_role(uuid, public.app_role) from public;
grant execute on function private.set_profile_role(uuid, public.app_role) to authenticated, service_role;

create policy "Admins can insert events"
  on public.events
  for insert
  to authenticated
  with check (private.user_role() = 'admin');

create policy "Admins can update events"
  on public.events
  for update
  to authenticated
  using (private.user_role() = 'admin')
  with check (private.user_role() = 'admin');

create policy "Admins can delete events"
  on public.events
  for delete
  to authenticated
  using (private.user_role() = 'admin');

create policy "Users and admins can read attendance"
  on public.attendance
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or private.user_role() = 'admin'
  );

create policy "Users and admins can insert attendance"
  on public.attendance
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    or private.user_role() = 'admin'
  );

create policy "Admins can delete attendance"
  on public.attendance
  for delete
  to authenticated
  using (private.user_role() = 'admin');

create policy "Admins can insert event photos"
  on public.event_photos
  for insert
  to authenticated
  with check (private.user_role() = 'admin');

create policy "Admins can update event photos"
  on public.event_photos
  for update
  to authenticated
  using (private.user_role() = 'admin')
  with check (private.user_role() = 'admin');

create policy "Admins can delete event photos"
  on public.event_photos
  for delete
  to authenticated
  using (private.user_role() = 'admin');

create policy "Admins can insert announcements"
  on public.announcements
  for insert
  to authenticated
  with check (private.user_role() = 'admin');

create policy "Admins can update announcements"
  on public.announcements
  for update
  to authenticated
  using (private.user_role() = 'admin')
  with check (private.user_role() = 'admin');

create policy "Admins can delete announcements"
  on public.announcements
  for delete
  to authenticated
  using (private.user_role() = 'admin');

create policy "Admins can upload event-photos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'event-photos'
    and private.user_role() = 'admin'
  );

create policy "Admins can update event-photos"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'event-photos'
    and private.user_role() = 'admin'
  )
  with check (
    bucket_id = 'event-photos'
    and private.user_role() = 'admin'
  );

create policy "Admins can delete event-photos"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'event-photos'
    and private.user_role() = 'admin'
  );

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
