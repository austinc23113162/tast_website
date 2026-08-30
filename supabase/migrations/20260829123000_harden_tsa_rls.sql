drop function if exists public.set_profile_role(uuid, public.app_role);

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

drop policy if exists "Users can read their own attendance" on public.attendance;
drop policy if exists "Officers and admins can read all attendance" on public.attendance;
drop policy if exists "Users can check themselves in" on public.attendance;
drop policy if exists "Officers and admins can insert attendance" on public.attendance;

create policy "Users and staff can read attendance"
  on public.attendance
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or private.user_role() in ('officer', 'admin')
  );

create policy "Users and staff can insert attendance"
  on public.attendance
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    or private.user_role() in ('officer', 'admin')
  );

create index if not exists announcements_created_by_idx on public.announcements (created_by);
create index if not exists event_photos_uploaded_by_idx on public.event_photos (uploaded_by);
