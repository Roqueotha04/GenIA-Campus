"use server";

import { errorState, successState, type FormState } from "@/lib/forms/form-state";
import { authorizeCourse, authorizeNotice } from "./course-authorization";
import { parseForm } from "./parse-form";
import { revalidateCourse } from "./revalidate-course";
import { createNoticeSchema, noticeIdSchema } from "./teacher-schemas";

export async function createNoticeAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(createNoticeSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeCourse(parsed.data.courseId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const { error } = await supabase
    .from("notices")
    .insert({ course_id: course.id, title: parsed.data.title, body: parsed.data.body });
  if (error) return errorState("No pudimos publicar el aviso. Probá de nuevo en unos segundos.");

  revalidateCourse(course);
  return successState("Aviso publicado.");
}

export async function deleteNoticeAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(noticeIdSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeNotice(parsed.data.noticeId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const { error } = await supabase.from("notices").delete().eq("id", parsed.data.noticeId);
  if (error) return errorState("No pudimos eliminar el aviso. Probá de nuevo en unos segundos.");

  revalidateCourse(course);
  return successState("Aviso eliminado.");
}
