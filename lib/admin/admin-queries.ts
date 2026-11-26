import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { COURSE_SUMMARY_COLUMNS, type CourseSummary } from "@/lib/courses/course-access";
import type { TableRow, UserRole } from "@/types/database";
import { buildProfileSearchFilter } from "./profile-search";

export type AdminProfile = TableRow<"profiles">;

export type CourseMemberRole = Exclude<UserRole, "admin">;

export type ProfileCountsByRole = Record<UserRole, number>;

export interface CourseCountsByStatus {
  published: number;
  draft: number;
}

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

export interface ProfileCourseMembership {
  role: CourseMemberRole;
  assignedCourses: CourseSummary[];
  assignableCourses: CourseSummary[];
}

function countByCourse(rows: { course_id: string }[]): Map<string, number> {
  const counts = new Map<string, number>();
  rows.forEach((row) => counts.set(row.course_id, (counts.get(row.course_id) ?? 0) + 1));
  return counts;
}

export async function listProfiles(role: UserRole | null, searchTerm: string): Promise<AdminProfile[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("profiles").select("*").order("full_name");
  if (role) query = query.eq("role", role);

  const searchFilter = buildProfileSearchFilter(searchTerm);
  if (searchFilter) query = query.or(searchFilter);

  const { data } = await query;
  return data ?? [];
}

export async function findProfile(profileId: string): Promise<AdminProfile | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", profileId).maybeSingle();
  return data;
}

export async function countProfilesByRole(): Promise<ProfileCountsByRole> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("profiles").select("role");
  const counts: ProfileCountsByRole = { admin: 0, docente: 0, alumno: 0 };
  (data ?? []).forEach((profile) => {
    counts[profile.role] += 1;
  });
  return counts;
}

export async function countCoursesByStatus(): Promise<CourseCountsByStatus> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("courses").select("is_published");
  const courses = data ?? [];
  const published = courses.filter((course) => course.is_published).length;
  return { published, draft: courses.length - published };
}

async function listCourseSummaries(): Promise<CourseSummary[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("courses")
    .select(COURSE_SUMMARY_COLUMNS)
    .order("level_slug")
    .order("module_number");
  return data ?? [];
}

export async function listCoursesWithCounts(): Promise<CourseWithCounts[]> {
  const supabase = await createSupabaseServerClient();
  const [courses, { data: teachers }, { data: enrollments }] = await Promise.all([
    listCourseSummaries(),
    supabase.from("course_teachers").select("course_id"),
    supabase.from("enrollments").select("course_id"),
  ]);

  const teacherCounts = countByCourse(teachers ?? []);
  const studentCounts = countByCourse(enrollments ?? []);

  return courses.map((course) => ({
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

async function listMembershipCourseIds(profileId: string, role: CourseMemberRole): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  if (role === "docente") {
    const { data } = await supabase
      .from("course_teachers")
      .select("course_id")
      .eq("teacher_id", profileId);
    return (data ?? []).map((row) => row.course_id);
  }

  const { data } = await supabase.from("enrollments").select("course_id").eq("student_id", profileId);
  return (data ?? []).map((row) => row.course_id);
}

export async function findProfileCourseMembership(
  profile: AdminProfile,
): Promise<ProfileCourseMembership | null> {
  const { role } = profile;
  if (role === "admin") return null;

  const [membershipCourseIds, courses] = await Promise.all([
    listMembershipCourseIds(profile.id, role),
    listCourseSummaries(),
  ]);

  return {
    role,
    assignedCourses: courses.filter((course) => membershipCourseIds.includes(course.id)),
    assignableCourses: courses.filter((course) => !membershipCourseIds.includes(course.id)),
  };
}
