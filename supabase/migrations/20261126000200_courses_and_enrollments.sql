create function public.generate_enrollment_key()
returns text
language sql
volatile
set search_path = ''
as $$
  select upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
$$;

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  level_slug text not null,
  module_number integer not null check (module_number > 0),
  title text not null check (length(trim(title)) > 0),
  description text not null default '',
  enrollment_key text not null default public.generate_enrollment_key(),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  unique (level_slug, module_number)
);

create table public.course_teachers (
  course_id uuid not null references public.courses (id) on delete cascade,
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (course_id, teacher_id)
);

create table public.enrollments (
  course_id uuid not null references public.courses (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  primary key (course_id, student_id)
);

create index course_teachers_teacher_id_idx on public.course_teachers (teacher_id);
create index enrollments_student_id_idx on public.enrollments (student_id);

alter table public.courses enable row level security;
alter table public.course_teachers enable row level security;
alter table public.enrollments enable row level security;

revoke select on public.courses from anon, authenticated;
grant select (id, level_slug, module_number, title, description, is_published, created_at)
  on public.courses to authenticated;

create function public.teaches(target_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.course_teachers
    where course_id = target_course_id
      and teacher_id = (select auth.uid())
  );
$$;

create function public.is_enrolled(target_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.enrollments
    where course_id = target_course_id
      and student_id = (select auth.uid())
  );
$$;

create function public.can_manage_course(target_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin() or public.teaches(target_course_id);
$$;

create function public.can_view_course(target_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.can_manage_course(target_course_id) or public.is_enrolled(target_course_id);
$$;

create function public.shares_course_with(profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.course_teachers as viewer_teaching
    join public.enrollments as student_enrollment
      on student_enrollment.course_id = viewer_teaching.course_id
    where viewer_teaching.teacher_id = (select auth.uid())
      and student_enrollment.student_id = profile_id
  )
  or exists (
    select 1
    from public.course_teachers as shared_teaching
    join public.course_teachers as viewer_teaching
      on viewer_teaching.course_id = shared_teaching.course_id
    where viewer_teaching.teacher_id = (select auth.uid())
      and shared_teaching.teacher_id = profile_id
  )
  or exists (
    select 1
    from public.enrollments as viewer_enrollment
    join public.course_teachers as teacher_of_course
      on teacher_of_course.course_id = viewer_enrollment.course_id
    where viewer_enrollment.student_id = (select auth.uid())
      and teacher_of_course.teacher_id = profile_id
  );
$$;

create policy "Course members read related profiles"
  on public.profiles
  for select
  to authenticated
  using ((select public.shares_course_with(id)));

create policy "Signed-in users browse published courses"
  on public.courses
  for select
  to authenticated
  using (is_published or (select public.can_manage_course(id)));

create policy "Admins manage courses"
  on public.courses
  for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Course members read teacher assignments"
  on public.course_teachers
  for select
  to authenticated
  using (
    (select public.can_view_course(course_id))
    or exists (
      select 1 from public.courses
      where courses.id = course_teachers.course_id and courses.is_published
    )
  );

create policy "Admins manage teacher assignments"
  on public.course_teachers
  for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Students read their enrollments"
  on public.enrollments
  for select
  to authenticated
  using (student_id = (select auth.uid()) or (select public.can_manage_course(course_id)));

create policy "Course managers remove enrollments"
  on public.enrollments
  for delete
  to authenticated
  using ((select public.can_manage_course(course_id)));

create policy "Admins enroll students"
  on public.enrollments
  for insert
  to authenticated
  with check ((select public.is_admin()));

create function public.enroll_with_key(target_course_id uuid, submitted_key text)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  key_matches boolean;
begin
  if (select auth.uid()) is null then
    return false;
  end if;

  select upper(trim(submitted_key)) = enrollment_key and is_published
    into key_matches
    from public.courses
    where id = target_course_id;

  if not coalesce(key_matches, false) then
    return false;
  end if;

  insert into public.enrollments (course_id, student_id)
  values (target_course_id, (select auth.uid()))
  on conflict do nothing;

  return true;
end;
$$;

create function public.course_enrollment_key(target_course_id uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select enrollment_key
  from public.courses
  where id = target_course_id
    and public.can_manage_course(target_course_id);
$$;

create function public.regenerate_enrollment_key(target_course_id uuid)
returns text
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  new_key text;
begin
  if not public.can_manage_course(target_course_id) then
    raise exception 'No tenés permiso para cambiar la clave de este curso.';
  end if;

  update public.courses
    set enrollment_key = public.generate_enrollment_key()
    where id = target_course_id
    returning enrollment_key into new_key;

  return new_key;
end;
$$;

revoke execute on function public.enroll_with_key(uuid, text) from anon;
revoke execute on function public.course_enrollment_key(uuid) from anon;
revoke execute on function public.regenerate_enrollment_key(uuid) from anon;
