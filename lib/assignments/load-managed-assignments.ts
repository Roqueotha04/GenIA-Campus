import "server-only";
import { buildCourseAssignmentHref } from "@/lib/course-content/course-routes";
import type { CourseSummary } from "@/lib/courses/course-access";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { ManagedAssignment } from "./assignment-types";

export async function loadManagedAssignments(course: CourseSummary): Promise<ManagedAssignment[]> {
  const supabase = await createSupabaseServerClient();
  const [{ data: assignments }, { data: submissions }, { count: enrolledCount }] = await Promise.all([
    supabase
      .from("assignments")
      .select("id, section_id, title, instructions, attachment_name, due_at, max_grade, allow_late")
      .eq("course_id", course.id)
      .order("due_at", { ascending: true, nullsFirst: false })
      .order("created_at"),
    supabase.from("submissions").select("assignment_id").eq("course_id", course.id),
    supabase.from("enrollments").select("student_id", { count: "exact", head: true }).eq("course_id", course.id),
  ]);

  return (assignments ?? []).map((assignment) => ({
    ...assignment,
    href: buildCourseAssignmentHref(course, assignment.id),
    submittedCount: (submissions ?? []).filter((submission) => submission.assignment_id === assignment.id).length,
    enrolledCount: enrolledCount ?? 0,
  }));
}
