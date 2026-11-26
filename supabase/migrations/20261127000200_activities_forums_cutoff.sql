create table public.forums (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  intro text not null default '',
  created_by uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create table public.forum_topics (
  id uuid primary key default gen_random_uuid(),
  forum_id uuid not null references public.forums (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null default auth.uid(),
  author_name text not null default '',
  title text not null check (length(trim(title)) > 0),
  body text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now()
);

create table public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.forum_topics (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null default auth.uid(),
  author_name text not null default '',
  body text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now()
);

create index forums_section_id_idx on public.forums (section_id);
create index forum_topics_forum_id_idx on public.forum_topics (forum_id, created_at desc);
create index forum_posts_topic_id_idx on public.forum_posts (topic_id, created_at);

alter table public.resources
  add column assignment_id uuid references public.assignments (id) on delete cascade,
  add column forum_id uuid references public.forums (id) on delete cascade;

alter table public.resources drop constraint resources_kind_has_target;
alter table public.resources add constraint resources_kind_has_target check (
  (kind = 'file' and storage_path is not null)
  or (kind = 'link' and url is not null)
  or (kind = 'game' and game_slug is not null)
  or (kind = 'quiz' and quiz_id is not null)
  or (kind = 'assignment' and assignment_id is not null)
  or (kind = 'forum' and forum_id is not null)
);

create unique index resources_assignment_id_key on public.resources (assignment_id) where assignment_id is not null;
create unique index resources_forum_id_key on public.resources (forum_id) where forum_id is not null;

alter table public.quizzes
  add column section_id uuid references public.sections (id) on delete set null;

alter table public.assignments add column cutoff_at timestamptz;
update public.assignments set cutoff_at = due_at where not allow_late;

create or replace function public.accepts_submissions(target_assignment_id uuid)
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
      and (cutoff_at is null or now() <= cutoff_at)
  );
$$;

alter table public.assignments drop column allow_late;
alter table public.assignments add constraint assignments_cutoff_after_due check (
  cutoff_at is null or due_at is null or cutoff_at >= due_at
);

with section_tails as (
  select section_id, coalesce(max(position), -1) as last_position
  from public.resources
  group by section_id
),
assignments_with_files as (
  select
    a.id,
    a.section_id,
    a.title,
    a.attachment_path,
    a.created_by,
    row_number() over (partition by a.section_id order by a.due_at nulls last, a.created_at) as offset_in_section
  from public.assignments a
  where a.attachment_path is not null
)
insert into public.resources (section_id, kind, title, storage_path, mime_type, size_bytes, position, created_by)
select
  f.section_id,
  'file',
  f.title,
  f.attachment_path,
  o.metadata ->> 'mimetype',
  (o.metadata ->> 'size')::bigint,
  coalesce(t.last_position, -1) + f.offset_in_section,
  f.created_by
from assignments_with_files f
left join section_tails t on t.section_id = f.section_id
left join storage.objects o on o.bucket_id = 'course-materials' and o.name = f.attachment_path;

delete from public.assignments where attachment_path is not null;

with section_tails as (
  select section_id, coalesce(max(position), -1) as last_position
  from public.resources
  group by section_id
),
remaining_assignments as (
  select
    a.id,
    a.section_id,
    a.title,
    a.created_by,
    row_number() over (partition by a.section_id order by a.due_at nulls last, a.created_at) as offset_in_section
  from public.assignments a
)
insert into public.resources (section_id, kind, title, assignment_id, position, created_by)
select
  r.section_id,
  'assignment',
  r.title,
  r.id,
  coalesce(t.last_position, -1) + r.offset_in_section,
  r.created_by
from remaining_assignments r
left join section_tails t on t.section_id = r.section_id;

create function public.copy_course_id_from_forum()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  select course_id into new.course_id from public.forums where id = new.forum_id;
  return new;
end;
$$;

create function public.copy_course_id_from_topic()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  select course_id into new.course_id from public.forum_topics where id = new.topic_id;
  return new;
end;
$$;

create function public.stamp_forum_author()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.author_id = (select auth.uid());
  select full_name into new.author_name from public.profiles where id = new.author_id;
  new.author_name = coalesce(new.author_name, '');
  new.created_at = now();
  return new;
end;
$$;

create trigger forums_copy_course_id
  before insert or update of section_id on public.forums
  for each row execute function public.copy_course_id_from_section();

create trigger forum_topics_copy_course_id
  before insert on public.forum_topics
  for each row execute function public.copy_course_id_from_forum();

create trigger forum_topics_stamp_author
  before insert on public.forum_topics
  for each row execute function public.stamp_forum_author();

create trigger forum_posts_copy_course_id
  before insert on public.forum_posts
  for each row execute function public.copy_course_id_from_topic();

create trigger forum_posts_stamp_author
  before insert on public.forum_posts
  for each row execute function public.stamp_forum_author();

alter table public.forums enable row level security;
alter table public.forum_topics enable row level security;
alter table public.forum_posts enable row level security;

create policy "Course members read forums"
  on public.forums for select to authenticated
  using ((select public.can_view_course(course_id)));

create policy "Course managers write forums"
  on public.forums for all to authenticated
  using ((select public.can_manage_course(course_id)))
  with check ((select public.can_manage_course(course_id)));

create policy "Course members read forum topics"
  on public.forum_topics for select to authenticated
  using ((select public.can_view_course(course_id)));

create policy "Course members open forum topics"
  on public.forum_topics for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and (select public.can_view_course(course_id))
  );

create policy "Authors and managers delete forum topics"
  on public.forum_topics for delete to authenticated
  using (
    author_id = (select auth.uid())
    or (select public.can_manage_course(course_id))
  );

create policy "Course members read forum posts"
  on public.forum_posts for select to authenticated
  using ((select public.can_view_course(course_id)));

create policy "Course members reply in forums"
  on public.forum_posts for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and (select public.can_view_course(course_id))
  );

create policy "Authors and managers delete forum posts"
  on public.forum_posts for delete to authenticated
  using (
    author_id = (select auth.uid())
    or (select public.can_manage_course(course_id))
  );

alter table public.forums replica identity full;
alter table public.forum_topics replica identity full;
alter table public.forum_posts replica identity full;

alter publication supabase_realtime
  add table public.forums, public.forum_topics, public.forum_posts;
