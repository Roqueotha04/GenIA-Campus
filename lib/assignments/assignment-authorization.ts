import "server-only";
import { getCurrentProfile, type CurrentProfile } from "@/lib/auth/current-profile";
import { COURSE_SUMMARY_COLUMNS, getCourseAccess, type CourseSummary } from "@/lib/courses/course-access";
import { errorState, type FormState } from "@/lib/forms/form-state";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { authorizeCourse, type AuthorizedCourse, type SupabaseServerClient } from "@/lib/teacher/course-authorization";
import { ASSIGNMENT_COLUMNS, type AssignmentRecord } from "./assignment-types";

export type AssignmentAuthorization =
  | { allowed: true; context: AuthorizedCourse & { assignment: AssignmentRecord } }
  | { allowed: false; state: FormState };

export interface StudentContext {
  supabase: SupabaseServerClient;
  course: CourseSummary;
  assignment: AssignmentRecord;
  profile: CurrentProfile;
}

export type StudentAuthorization =
  | { allowed: true; context: StudentContext }
  | { allowed: false; state: FormState };

const SESSION_EXPIRED = errorState("Tu sesión venció. Volvé a iniciar sesión y probá de nuevo.");
const NOT_FOUND = errorState("No encontramos esa entrega. Recargá la página y probá de nuevo.");
const NOT_ENROLLED = errorState("Solo los alumnos inscriptos en el curso pueden entregar. Inscribite con la clave del curso.");

export async function authorizeAssignment(assignmentId: string): Promise<AssignmentAuthorization> {
  const supabase = await createSupabaseServerClient();
  const { data: assignment } = await supabase
    .from("assignments")
    .select(ASSIGNMENT_COLUMNS)
    .eq("id", assignmentId)
    .maybeSingle();
  if (!assignment) return { allowed: false, state: NOT_FOUND };

  const authorization = await authorizeCourse(assignment.course_id);
  if (!authorization.allowed) return authorization;
  return { allowed: true, context: { ...authorization.context, assignment } };
}

export async function authorizeSubmissionCourse(submissionId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: submission } = await supabase
    .from("submissions")
    .select("id, assignment_id")
    .eq("id", submissionId)
    .maybeSingle();
  if (!submission) return { allowed: false, state: NOT_FOUND } as const;

  const authorization = await authorizeAssignment(submission.assignment_id);
  if (!authorization.allowed) return authorization;
  return { allowed: true, context: authorization.context } as const;
}

export async function authorizeStudent(assignmentId: string): Promise<StudentAuthorization> {
  const profile = await getCurrentProfile();
  if (!profile) return { allowed: false, state: SESSION_EXPIRED };

  const supabase = await createSupabaseServerClient();
  const { data: assignment } = await supabase
    .from("assignments")
    .select(ASSIGNMENT_COLUMNS)
    .eq("id", assignmentId)
    .maybeSingle();
  if (!assignment) return { allowed: false, state: NOT_FOUND };

  const { data: course } = await supabase
    .from("courses")
    .select(COURSE_SUMMARY_COLUMNS)
    .eq("id", assignment.course_id)
    .maybeSingle();
  if (!course) return { allowed: false, state: NOT_FOUND };

  const { isEnrolled } = await getCourseAccess(course.id, profile);
  if (!isEnrolled) return { allowed: false, state: NOT_ENROLLED };

  return { allowed: true, context: { supabase, course, assignment, profile } };
}
