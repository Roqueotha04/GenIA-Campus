"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/current-profile";
import { errorState, successState, type FormState } from "@/lib/forms/form-state";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ADMIN_COURSES_PATH, ADMIN_PATH, buildAdminCoursePath } from "./admin-paths";
import {
  courseIdSchema,
  courseStudentSchema,
  courseTeacherSchema,
  createCourseSchema,
  updateCourseSchema,
} from "./admin-schemas";
import { findCourseModuleChoice } from "./course-options";
import { firstIssueMessage } from "./schema-feedback";

const UNIQUE_VIOLATION_CODE = "23505";
const GENERIC_FAILURE_MESSAGE = "No pudimos completar el cambio. Esperá unos segundos e intentá de nuevo.";

function revalidateCoursePages(courseId: string) {
  revalidatePath(ADMIN_PATH);
  revalidatePath(ADMIN_COURSES_PATH);
  revalidatePath(buildAdminCoursePath(courseId));
}

export async function createCourse(_previousState: FormState, formData: FormData): Promise<FormState> {
  await requireRole("admin");

  const parsed = createCourseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState(firstIssueMessage(parsed.error));

  const choice = findCourseModuleChoice(parsed.data.moduleKey);
  if (!choice) return errorState("Ese nivel y módulo no existen en el campus. Elegí uno de la lista.");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("courses")
    .insert({
      level_slug: choice.levelSlug,
      module_number: choice.moduleNumber,
      title: parsed.data.title || choice.label,
      description: parsed.data.description,
      is_published: parsed.data.isPublished,
    })
    .select("id")
    .single();

  if (error?.code === UNIQUE_VIOLATION_CODE) {
    return errorState(`Ya existe un curso para ${choice.label}. Buscalo en el listado para editarlo.`);
  }
  if (error || !data) return errorState(GENERIC_FAILURE_MESSAGE);

  revalidatePath(ADMIN_PATH);
  revalidatePath(ADMIN_COURSES_PATH);
  redirect(`${buildAdminCoursePath(data.id)}?creado=1`);
}

export async function updateCourse(_previousState: FormState, formData: FormData): Promise<FormState> {
  await requireRole("admin");

  const parsed = updateCourseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState(firstIssueMessage(parsed.error));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("courses")
    .update({
      title: parsed.data.title,
      description: parsed.data.description,
      is_published: parsed.data.isPublished,
    })
    .eq("id", parsed.data.id);
  if (error) return errorState(GENERIC_FAILURE_MESSAGE);

  revalidateCoursePages(parsed.data.id);
  return successState("Guardamos los datos del curso.");
}

export async function regenerateCourseKey(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole("admin");

  const parsed = courseIdSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState(firstIssueMessage(parsed.error));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("regenerate_enrollment_key", {
    target_course_id: parsed.data.id,
  });
  if (error) return errorState(GENERIC_FAILURE_MESSAGE);

  revalidatePath(buildAdminCoursePath(parsed.data.id));
  return successState("Generamos una clave nueva. La anterior ya no sirve para inscribirse.");
}

export async function assignTeacher(_previousState: FormState, formData: FormData): Promise<FormState> {
  await requireRole("admin");

  const parsed = courseTeacherSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState(firstIssueMessage(parsed.error));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("course_teachers")
    .insert({ course_id: parsed.data.courseId, teacher_id: parsed.data.teacherId });

  if (error?.code === UNIQUE_VIOLATION_CODE) return errorState("Ese docente ya está asignado al curso.");
  if (error) return errorState(GENERIC_FAILURE_MESSAGE);

  revalidateCoursePages(parsed.data.courseId);
  return successState("Asignamos al docente al curso.");
}

export async function removeTeacher(_previousState: FormState, formData: FormData): Promise<FormState> {
  await requireRole("admin");

  const parsed = courseTeacherSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState(firstIssueMessage(parsed.error));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("course_teachers")
    .delete()
    .eq("course_id", parsed.data.courseId)
    .eq("teacher_id", parsed.data.teacherId);
  if (error) return errorState(GENERIC_FAILURE_MESSAGE);

  revalidateCoursePages(parsed.data.courseId);
  return successState("Quitamos al docente del curso.");
}

export async function enrollStudent(_previousState: FormState, formData: FormData): Promise<FormState> {
  await requireRole("admin");

  const parsed = courseStudentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState(firstIssueMessage(parsed.error));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("enrollments")
    .insert({ course_id: parsed.data.courseId, student_id: parsed.data.studentId });

  if (error?.code === UNIQUE_VIOLATION_CODE) return errorState("Ese alumno ya está inscripto en el curso.");
  if (error) return errorState(GENERIC_FAILURE_MESSAGE);

  revalidateCoursePages(parsed.data.courseId);
  return successState("Inscribimos al alumno en el curso.");
}

export async function removeEnrollment(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole("admin");

  const parsed = courseStudentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState(firstIssueMessage(parsed.error));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("enrollments")
    .delete()
    .eq("course_id", parsed.data.courseId)
    .eq("student_id", parsed.data.studentId);
  if (error) return errorState(GENERIC_FAILURE_MESSAGE);

  revalidateCoursePages(parsed.data.courseId);
  return successState("Quitamos al alumno del curso.");
}

export async function deleteCourse(_previousState: FormState, formData: FormData): Promise<FormState> {
  await requireRole("admin");

  const parsed = courseIdSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState(firstIssueMessage(parsed.error));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("courses").delete().eq("id", parsed.data.id);
  if (error) return errorState(GENERIC_FAILURE_MESSAGE);

  revalidatePath(ADMIN_PATH);
  revalidatePath(ADMIN_COURSES_PATH);
  redirect(ADMIN_COURSES_PATH);
}
