insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'course-materials',
    'course-materials',
    false,
    52428800,
    array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
      'application/x-zip-compressed',
      'text/plain',
      'text/csv',
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif'
    ]
  ),
  (
    'submissions',
    'submissions',
    false,
    52428800,
    array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
      'application/x-zip-compressed',
      'text/plain',
      'text/csv',
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif'
    ]
  );

create function public.course_id_from_storage_path(object_name text)
returns uuid
language plpgsql
immutable
set search_path = ''
as $$
begin
  return (string_to_array(object_name, '/'))[1]::uuid;
exception
  when invalid_text_representation then
    return null;
end;
$$;

create function public.student_id_from_submission_path(object_name text)
returns uuid
language plpgsql
immutable
set search_path = ''
as $$
begin
  return (string_to_array(object_name, '/'))[3]::uuid;
exception
  when invalid_text_representation then
    return null;
end;
$$;

create policy "Course members read course materials"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'course-materials'
    and (select public.can_view_course(public.course_id_from_storage_path(name)))
  );

create policy "Course managers upload course materials"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'course-materials'
    and (select public.can_manage_course(public.course_id_from_storage_path(name)))
  );

create policy "Course managers update course materials"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'course-materials'
    and (select public.can_manage_course(public.course_id_from_storage_path(name)))
  );

create policy "Course managers delete course materials"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'course-materials'
    and (select public.can_manage_course(public.course_id_from_storage_path(name)))
  );

create policy "Students and managers read submission files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'submissions'
    and (
      public.student_id_from_submission_path(name) = (select auth.uid())
      or (select public.can_manage_course(public.course_id_from_storage_path(name)))
    )
  );

create policy "Enrolled students upload their submission files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'submissions'
    and public.student_id_from_submission_path(name) = (select auth.uid())
    and (select public.is_enrolled(public.course_id_from_storage_path(name)))
  );

create policy "Students replace their submission files"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'submissions'
    and public.student_id_from_submission_path(name) = (select auth.uid())
  );

create policy "Students and managers delete submission files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'submissions'
    and (
      public.student_id_from_submission_path(name) = (select auth.uid())
      or (select public.can_manage_course(public.course_id_from_storage_path(name)))
    )
  );

alter publication supabase_realtime
  add table public.sections, public.resources, public.assignments, public.notices;
