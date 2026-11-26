import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { COURSE_MATERIALS_BUCKET } from "@/lib/storage/storage-buckets";
import { createSignedDownloadUrls } from "@/lib/storage/signed-downloads";
import type { CourseSummary } from "@/lib/courses/course-access";
import {
  buildCourseSections,
  buildDueDatesByAssignment,
  collectDownloadableFiles,
  type AssignmentDueRow,
  type ResourceRow,
  type SectionRow,
} from "./build-course-sections";
import type { CourseNoticeItem, CourseSectionContent } from "./course-content-types";
import { formatNoticeDate } from "./format-course-date";

async function readProfileNames(profileIds: string[]): Promise<Map<string, string>> {
  if (profileIds.length === 0) return new Map();

  const supabase = await createSupabaseServerClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", profileIds);

  return new Map((profiles ?? []).map((profile) => [profile.id, profile.full_name]));
}

export const getCourseSections = cache(
  async (course: CourseSummary): Promise<CourseSectionContent[]> => {
    const supabase = await createSupabaseServerClient();
    const [sectionsResult, resourcesResult, assignmentsResult] = await Promise.all([
      supabase
        .from("sections")
        .select("id, title, description, position")
        .eq("course_id", course.id)
        .order("position")
        .order("created_at"),
      supabase
        .from("resources")
        .select("id, section_id, kind, title, storage_path, url, game_slug, quiz_id, assignment_id, forum_id")
        .eq("course_id", course.id)
        .order("position")
        .order("created_at"),
      supabase.from("assignments").select("id, due_at").eq("course_id", course.id),
    ]);

    const sections: SectionRow[] = sectionsResult.data ?? [];
    const resources: ResourceRow[] = resourcesResult.data ?? [];
    const assignments: AssignmentDueRow[] = assignmentsResult.data ?? [];
    const signedUrls = await createSignedDownloadUrls(
      COURSE_MATERIALS_BUCKET,
      collectDownloadableFiles(resources),
    );

    return buildCourseSections({
      course,
      sections,
      resources,
      signedUrls,
      dueDatesByAssignment: buildDueDatesByAssignment(assignments),
    });
  },
);

export const hasCourseGame = cache(async (courseId: string, gameSlug: string): Promise<boolean> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("resources")
    .select("id")
    .eq("course_id", courseId)
    .eq("kind", "game")
    .eq("game_slug", gameSlug)
    .limit(1);

  return (data?.length ?? 0) > 0;
});

export const listCourseNotices = cache(
  async (courseId: string, limit?: number): Promise<CourseNoticeItem[]> => {
    const supabase = await createSupabaseServerClient();
    const query = supabase
      .from("notices")
      .select("id, title, body, created_at, author_id")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false });
    const { data: notices } = await (limit ? query.limit(limit) : query);
    if (!notices || notices.length === 0) return [];

    const authorIds = [...new Set(notices.flatMap((notice) => notice.author_id ?? []))];
    const authorNames = await readProfileNames(authorIds);

    return notices.map((notice) => ({
      id: notice.id,
      title: notice.title,
      body: notice.body,
      createdLabel: formatNoticeDate(notice.created_at),
      authorName: notice.author_id ? (authorNames.get(notice.author_id) ?? null) : null,
    }));
  },
);

export const listCourseTeacherNames = cache(async (courseId: string): Promise<string[]> => {
  const supabase = await createSupabaseServerClient();
  const { data: assignments } = await supabase
    .from("course_teachers")
    .select("teacher_id")
    .eq("course_id", courseId);

  const teacherIds = (assignments ?? []).map((assignment) => assignment.teacher_id);
  const names = await readProfileNames(teacherIds);
  return [...names.values()];
});
