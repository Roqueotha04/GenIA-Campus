import "server-only";
import { getCurrentProfile } from "@/lib/auth/current-profile";
import { COURSE_SUMMARY_COLUMNS, getCourseAccess, type CourseSummary } from "@/lib/courses/course-access";
import { errorState, type FormState } from "@/lib/forms/form-state";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export interface AuthorizedCourse {
  supabase: SupabaseServerClient;
  course: CourseSummary;
}

export type Authorization =
  | { allowed: true; context: AuthorizedCourse }
  | { allowed: false; state: FormState };

const SESSION_EXPIRED = errorState("Tu sesión venció. Volvé a iniciar sesión y probá de nuevo.");
const NOT_FOUND = errorState("No encontramos ese elemento. Recargá la página y probá de nuevo.");
const FORBIDDEN = errorState("No tenés permiso para gestionar este curso. Pedile acceso a un administrador.");

export async function authorizeCourse(courseId: string): Promise<Authorization> {
  const profile = await getCurrentProfile();
  if (!profile) return { allowed: false, state: SESSION_EXPIRED };

  const supabase = await createSupabaseServerClient();
  const { data: course } = await supabase
    .from("courses")
    .select(COURSE_SUMMARY_COLUMNS)
    .eq("id", courseId)
    .maybeSingle();
  if (!course) return { allowed: false, state: NOT_FOUND };

  const { canManage } = await getCourseAccess(course.id, profile);
  if (!canManage) return { allowed: false, state: FORBIDDEN };

  return { allowed: true, context: { supabase, course } };
}

type OwnedTable = "sections" | "resources" | "notices";

async function authorizeOwnedRow(table: OwnedTable, rowId: string): Promise<Authorization> {
  const supabase = await createSupabaseServerClient();
  const { data: row } = await supabase.from(table).select("course_id").eq("id", rowId).maybeSingle();
  if (!row) return { allowed: false, state: NOT_FOUND };
  return authorizeCourse(row.course_id);
}

export const authorizeSection = (sectionId: string) => authorizeOwnedRow("sections", sectionId);

export const authorizeResource = (resourceId: string) => authorizeOwnedRow("resources", resourceId);

export const authorizeNotice = (noticeId: string) => authorizeOwnedRow("notices", noticeId);
