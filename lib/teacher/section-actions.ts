"use server";

import {
  collectAssignmentStoredFiles,
  removeAssignmentStoredFiles,
} from "@/lib/assignments/assignment-stored-files";
import { removeStoredFiles } from "@/lib/assignments/remove-stored-files";
import { COURSE_MATERIALS_BUCKET } from "@/lib/storage/storage-buckets";
import { errorState, successState, type FormState } from "@/lib/forms/form-state";
import { authorizeCourse, authorizeSection } from "./course-authorization";
import { parseForm } from "./parse-form";
import { nextSectionPosition, persistPositions, swapWithNeighbor } from "./reorder";
import { revalidateCourse } from "./revalidate-course";
import {
  createSectionSchema,
  moveSectionSchema,
  sectionIdSchema,
  updateSectionSchema,
} from "./teacher-schemas";

export async function createSectionAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(createSectionSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeCourse(parsed.data.courseId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const position = await nextSectionPosition(supabase, course.id);
  const { error } = await supabase.from("sections").insert({
    course_id: course.id,
    title: parsed.data.title,
    description: parsed.data.description,
    position,
  });
  if (error) return errorState("No pudimos crear la sección. Probá de nuevo en unos segundos.");

  revalidateCourse(course);
  return successState("Sección creada.");
}

export async function updateSectionAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(updateSectionSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeSection(parsed.data.sectionId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const { error } = await supabase
    .from("sections")
    .update({ title: parsed.data.title, description: parsed.data.description })
    .eq("id", parsed.data.sectionId);
  if (error) return errorState("No pudimos guardar los cambios. Probá de nuevo en unos segundos.");

  revalidateCourse(course);
  return successState("Cambios guardados.");
}

export async function deleteSectionAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(sectionIdSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeSection(parsed.data.sectionId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const [{ data: files }, { data: assignments }] = await Promise.all([
    supabase.from("resources").select("storage_path").eq("section_id", parsed.data.sectionId).eq("kind", "file"),
    supabase.from("assignments").select("id").eq("section_id", parsed.data.sectionId),
  ]);
  const assignmentFiles = await collectAssignmentStoredFiles(
    supabase,
    (assignments ?? []).map((assignment) => assignment.id),
  );

  const { error } = await supabase.from("sections").delete().eq("id", parsed.data.sectionId);
  if (error) return errorState("No pudimos eliminar la sección. Probá de nuevo en unos segundos.");

  await Promise.all([
    removeStoredFiles(supabase, COURSE_MATERIALS_BUCKET, (files ?? []).map((file) => file.storage_path)),
    removeAssignmentStoredFiles(supabase, assignmentFiles),
  ]);

  revalidateCourse(course);
  return successState("Sección eliminada.");
}

export async function moveSectionAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(moveSectionSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeSection(parsed.data.sectionId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const { data: sections } = await supabase
    .from("sections")
    .select("id")
    .eq("course_id", course.id)
    .order("position")
    .order("created_at");

  const reordered = swapWithNeighbor(sections ?? [], parsed.data.sectionId, parsed.data.direction);
  if (!reordered) return errorState("La sección ya está en ese extremo de la lista.");

  const saved = await persistPositions(supabase, "sections", reordered.map((section) => section.id));
  if (!saved) return errorState("No pudimos reordenar las secciones. Recargá la página y probá de nuevo.");

  revalidateCourse(course);
  return successState("Orden actualizado.");
}
