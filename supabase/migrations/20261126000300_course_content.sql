create type public.resource_kind as enum ('file', 'link', 'game', 'quiz');

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  description text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  description text not null default '',
  passing_score integer not null default 1 check (passing_score > 0),
  questions jsonb not null default '[]'::jsonb check (jsonb_typeof(questions) = 'array'),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  kind public.resource_kind not null,
  title text not null check (length(trim(title)) > 0),
  storage_path text,
  url text,
  game_slug text,
  quiz_id uuid references public.quizzes (id) on delete cascade,
  mime_type text,
  size_bytes bigint,
  position integer not null default 0,
  created_by uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  constraint resources_kind_has_target check (
    (kind = 'file' and storage_path is not null)
    or (kind = 'link' and url is not null)
    or (kind = 'game' and game_slug is not null)
    or (kind = 'quiz' and quiz_id is not null)
  )
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  instructions text not null default '',
  attachment_path text,
  attachment_name text,
  due_at timestamptz,
  max_grade numeric(5, 2) not null default 10 check (max_grade > 0),
  allow_late boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade default auth.uid(),
  text_answer text,
  link_url text,
  file_path text,
  file_name text,
  submitted_at timestamptz not null default now(),
  grade numeric(5, 2),
  feedback text,
  graded_by uuid references public.profiles (id) on delete set null,
  graded_at timestamptz,
  unique (assignment_id, student_id),
  constraint submissions_has_content check (
    text_answer is not null or link_url is not null or file_path is not null
  )
);

create table public.notices (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null default auth.uid(),
  title text not null check (length(trim(title)) > 0),
  body text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now()
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  answers jsonb not null,
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  submitted_at timestamptz not null default now()
);

create index sections_course_id_idx on public.sections (course_id, position);
create index resources_section_id_idx on public.resources (section_id, position);
create index resources_course_id_idx on public.resources (course_id);
create index assignments_course_id_idx on public.assignments (course_id);
create index submissions_course_id_idx on public.submissions (course_id);
create index submissions_student_id_idx on public.submissions (student_id);
create index notices_course_id_idx on public.notices (course_id, created_at desc);
create index quizzes_course_id_idx on public.quizzes (course_id);
create index quiz_attempts_quiz_id_idx on public.quiz_attempts (quiz_id);
create index quiz_attempts_student_id_idx on public.quiz_attempts (student_id);

create function public.copy_course_id_from_section()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  select course_id into new.course_id from public.sections where id = new.section_id;
  return new;
end;
$$;

create trigger resources_copy_course_id
  before insert or update of section_id on public.resources
  for each row execute function public.copy_course_id_from_section();

create trigger assignments_copy_course_id
  before insert or update of section_id on public.assignments
  for each row execute function public.copy_course_id_from_section();

create function public.copy_course_id_from_assignment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  select course_id into new.course_id from public.assignments where id = new.assignment_id;
  return new;
end;
$$;

create trigger submissions_copy_course_id
  before insert or update of assignment_id on public.submissions
  for each row execute function public.copy_course_id_from_assignment();

create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger quizzes_touch_updated_at
  before update on public.quizzes
  for each row execute function public.touch_updated_at();

create function public.accepts_submissions(target_assignment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.assignments
    where id = target_assignment_id
      and (due_at is null or allow_late or now() <= due_at)
  );
$$;

create function public.protect_submission_grading()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.can_manage_course(new.course_id) then
    if tg_op = 'UPDATE' then
      new.student_id = old.student_id;
      new.text_answer = old.text_answer;
      new.link_url = old.link_url;
      new.file_path = old.file_path;
      new.file_name = old.file_name;
      new.submitted_at = old.submitted_at;
      new.graded_by = (select auth.uid());
      new.graded_at = now();
    end if;
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.grade = null;
    new.feedback = null;
    new.graded_by = null;
    new.graded_at = null;
  else
    new.grade = old.grade;
    new.feedback = old.feedback;
    new.graded_by = old.graded_by;
    new.graded_at = old.graded_at;
  end if;
  new.student_id = (select auth.uid());
  new.submitted_at = now();
  return new;
end;
$$;

create trigger submissions_protect_grading
  before insert or update on public.submissions
  for each row execute function public.protect_submission_grading();

alter table public.sections enable row level security;
alter table public.quizzes enable row level security;
alter table public.resources enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.notices enable row level security;
alter table public.quiz_attempts enable row level security;

create policy "Course members read sections"
  on public.sections for select to authenticated
  using ((select public.can_view_course(course_id)));

create policy "Course managers write sections"
  on public.sections for all to authenticated
  using ((select public.can_manage_course(course_id)))
  with check ((select public.can_manage_course(course_id)));

create policy "Course members read resources"
  on public.resources for select to authenticated
  using ((select public.can_view_course(course_id)));

create policy "Course managers write resources"
  on public.resources for all to authenticated
  using ((select public.can_manage_course(course_id)))
  with check ((select public.can_manage_course(course_id)));

create policy "Course members read assignments"
  on public.assignments for select to authenticated
  using ((select public.can_view_course(course_id)));

create policy "Course managers write assignments"
  on public.assignments for all to authenticated
  using ((select public.can_manage_course(course_id)))
  with check ((select public.can_manage_course(course_id)));

create policy "Students and managers read submissions"
  on public.submissions for select to authenticated
  using (
    student_id = (select auth.uid())
    or (select public.can_manage_course(course_id))
  );

create policy "Enrolled students submit while open"
  on public.submissions for insert to authenticated
  with check (
    student_id = (select auth.uid())
    and (select public.is_enrolled(course_id))
    and (select public.accepts_submissions(assignment_id))
  );

create policy "Students resubmit while open and managers grade"
  on public.submissions for update to authenticated
  using (
    (student_id = (select auth.uid()) and (select public.accepts_submissions(assignment_id)))
    or (select public.can_manage_course(course_id))
  )
  with check (
    (student_id = (select auth.uid()) and (select public.accepts_submissions(assignment_id)))
    or (select public.can_manage_course(course_id))
  );

create policy "Course managers delete submissions"
  on public.submissions for delete to authenticated
  using ((select public.can_manage_course(course_id)));

create policy "Course members read notices"
  on public.notices for select to authenticated
  using ((select public.can_view_course(course_id)));

create policy "Course managers write notices"
  on public.notices for all to authenticated
  using ((select public.can_manage_course(course_id)))
  with check ((select public.can_manage_course(course_id)));

create policy "Course managers manage quizzes"
  on public.quizzes for all to authenticated
  using ((select public.can_manage_course(course_id)))
  with check ((select public.can_manage_course(course_id)));

create policy "Students and managers read attempts"
  on public.quiz_attempts for select to authenticated
  using (
    student_id = (select auth.uid())
    or (select public.can_manage_course(course_id))
  );

create policy "Course managers delete attempts"
  on public.quiz_attempts for delete to authenticated
  using ((select public.can_manage_course(course_id)));
