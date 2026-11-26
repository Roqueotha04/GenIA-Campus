import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { COURSE_SUMMARY_COLUMNS, type CourseSummary } from "@/lib/courses/course-access";
import type { TableRow, UserRole } from "@/types/database";

export type AdminProfile = TableRow<"profiles">;

export interface CourseWithCounts extends CourseSummary {
  teacherCount: number;
  studentCount: number;
}

export interface CourseDetail {
  course: CourseSummary;
  enrollmentKey: string;
  teachers: AdminProfile[];
  students: AdminProfile[];
}

function countByCourse(rows: { course_id: string }[]): Map<string, number> {
  const counts = new Map<string, number>();
  rows.forEach((row) => counts.set(row.course_id, (counts.get(row.course_id) ?? 0) + 1));
  return counts;
}

export async function listProfiles(role: UserRole | null): Promise<AdminProfile[]> {
  const supabase = await createSupabaseServerClient();
  const query = supabase.from("profiles").select("*").order("full_name");
  const { data } = await (role ? query.eq("role", role) : query);
  return data ?? [];
}

export async function findProfile(profileId: string): Promise<AdminProfile | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", profileId).maybeSingle();
  return data;
}

export async function countRows(table: "profiles" | "courses"): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
  return count ?? 0;
}

export async function listCoursesWithCounts(): Promise<CourseWithCounts[]> {
  const supabase = await createSupabaseServerClient();
  const [{ data: courses }, { data: teachers }, { data: enrollments }] = await Promise.all([
    supabase.from("courses").select(COURSE_SUMMARY_COLUMNS).order("level_slug").order("module_number"),
    supabase.from("course_teachers").select("course_id"),
    supabase.from("enrollments").select("course_id"),
  ]);

  const teacherCounts = countByCourse(teachers ?? []);
  const studentCounts = countByCourse(enrollments ?? []);

  return (courses ?? []).map((course) => ({
    ...course,
    teacherCount: teacherCounts.get(course.id) ?? 0,
    studentCount: studentCounts.get(course.id) ?? 0,
  }));
}

async function listProfilesByIds(profileIds: string[]): Promise<AdminProfile[]> {
  if (profileIds.length === 0) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .in("id", profileIds)
    .order("full_name");
  return data ?? [];
}

export async function findCourseDetail(courseId: string): Promise<CourseDetail | null> {
  const supabase = await createSupabaseServerClient();
  const [{ data: course }, { data: enrollmentKey }, { data: teacherRows }, { data: studentRows }] =
    await Promise.all([
      supabase.from("courses").select(COURSE_SUMMARY_COLUMNS).eq("id", courseId).maybeSingle(),
      supabase.rpc("course_enrollment_key", { target_course_id: courseId }),
      supabase.from("course_teachers").select("teacher_id").eq("course_id", courseId),
      supabase.from("enrollments").select("student_id").eq("course_id", courseId),
    ]);

  if (!course) return null;

  const [teachers, students] = await Promise.all([
    listProfilesByIds((teacherRows ?? []).map((row) => row.teacher_id)),
    listProfilesByIds((studentRows ?? []).map((row) => row.student_id)),
  ]);

  return { course, enrollmentKey: enrollmentKey ?? "", teachers, students };
}

export async function listAssignableProfiles(
  role: UserRole,
  excludedIds: string[],
): Promise<AdminProfile[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", role)
    .eq("is_active", true)
    .order("full_name");
  return (data ?? []).filter((profile) => !excludedIds.includes(profile.id));
}
