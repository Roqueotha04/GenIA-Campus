import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { CurrentProfile } from "@/lib/auth/current-profile";
import { COURSE_SUMMARY_COLUMNS, type CourseSummary } from "@/lib/courses/course-access";
import type { ModuleAvailability } from "./course-content-types";

async function readLinkedCourseIds(profile: CurrentProfile): Promise<string[]> {
  const supabase = await createSupabaseServerClient();

  if (profile.role === "docente") {
    const { data } = await supabase
      .from("course_teachers")
      .select("course_id")
      .eq("teacher_id", profile.id);
    return (data ?? []).map((row) => row.course_id);
  }

  const { data } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("student_id", profile.id);
  return (data ?? []).map((row) => row.course_id);
}

export async function listMyCourses(profile: CurrentProfile): Promise<CourseSummary[]> {
  const supabase = await createSupabaseServerClient();
  const baseQuery = supabase
    .from("courses")
    .select(COURSE_SUMMARY_COLUMNS)
    .order("level_slug")
    .order("module_number");

  if (profile.role === "admin") {
    const { data } = await baseQuery;
    return data ?? [];
  }

  const courseIds = await readLinkedCourseIds(profile);
  if (courseIds.length === 0) return [];

  const { data } = await baseQuery.in("id", courseIds);
  return data ?? [];
}

export async function getModuleAvailability(
  levelSlug: string,
  profile: CurrentProfile,
): Promise<Record<number, ModuleAvailability>> {
  const supabase = await createSupabaseServerClient();
  const [{ data: courses }, { data: enrollments }] = await Promise.all([
    supabase
      .from("courses")
      .select("id, module_number")
      .eq("level_slug", levelSlug)
      .eq("is_published", true),
    supabase.from("enrollments").select("course_id").eq("student_id", profile.id),
  ]);

  const enrolledCourseIds = new Set((enrollments ?? []).map((row) => row.course_id));
  return Object.fromEntries(
    (courses ?? []).map((course): [number, ModuleAvailability] => [
      course.module_number,
      enrolledCourseIds.has(course.id) ? "enrolled" : "available",
    ]),
  );
}
