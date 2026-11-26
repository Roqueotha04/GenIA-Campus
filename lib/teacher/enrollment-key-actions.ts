"use server";

import { errorState, successState, type FormState } from "@/lib/forms/form-state";
import { authorizeCourse } from "./course-authorization";
import { parseForm } from "./parse-form";
import { revalidateCourse } from "./revalidate-course";
import { courseIdSchema } from "./teacher-schemas";

export async function regenerateEnrollmentKeyAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parseForm(courseIdSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeCourse(parsed.data.courseId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const { error } = await supabase.rpc("regenerate_enrollment_key", { target_course_id: course.id });
  if (error) return errorState("No pudimos generar una clave nueva. Probá de nuevo en unos segundos.");

  revalidateCourse(course);
  return successState("Clave nueva generada. La anterior ya no sirve para inscribirse.");
}
