"use server";

import { errorState, successState, type FormState } from "@/lib/forms/form-state";
import { COURSE_MATERIALS_BUCKET } from "@/lib/storage/storage-buckets";
import { authorizeSection } from "@/lib/teacher/course-authorization";
import { parseInput } from "@/lib/teacher/parse-form";
import { nextResourcePosition } from "@/lib/teacher/reorder";
import { authorizeAssignment } from "./assignment-authorization";
import {
  createAssignmentSchema,
  updateAssignmentSchema,
  type CreateAssignmentInput,
  type UpdateAssignmentInput,
} from "./assignment-schemas";
import { removeStoredFiles } from "./remove-stored-files";
import { revalidateAssignment } from "./revalidate-assignment";

const INVALID_ATTACHMENT = errorState("El adjunto no es válido. Subilo de nuevo.");
const CREATE_FAILED = errorState("No pudimos crear la tarea. Revisá los datos y probá de nuevo.");

export async function createAssignment(input: CreateAssignmentInput): Promise<FormState> {
  const parsed = parseInput(createAssignmentSchema, input);
  if (!parsed.valid) return parsed.state;
  const { sectionId, attachment, dueAt, cutoffAt, maxGrade, title, instructions } = parsed.data;

  const authorization = await authorizeSection(sectionId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  if (attachment && !attachment.path.startsWith(`${course.id}/${sectionId}/`)) return INVALID_ATTACHMENT;

  const discardAttachment = () => removeStoredFiles(supabase, COURSE_MATERIALS_BUCKET, [attachment?.path ?? null]);

  const { data: created, error } = await supabase
    .from("assignments")
    .insert({
      section_id: sectionId,
      title,
      instructions,
      attachment_path: attachment?.path ?? null,
      attachment_name: attachment?.name ?? null,
      due_at: dueAt,
      cutoff_at: cutoffAt,
      max_grade: maxGrade,
    })
    .select("id")
    .single();
  if (error || !created) {
    await discardAttachment();
    return CREATE_FAILED;
  }

  const position = await nextResourcePosition(supabase, sectionId);
  const { error: resourceError } = await supabase.from("resources").insert({
    section_id: sectionId,
    kind: "assignment",
    title,
    assignment_id: created.id,
    position,
  });
  if (resourceError) {
    await supabase.from("assignments").delete().eq("id", created.id);
    await discardAttachment();
    return CREATE_FAILED;
  }

  revalidateAssignment(course, created.id);
  return successState("Tarea creada.");
}

export async function updateAssignment(input: UpdateAssignmentInput): Promise<FormState> {
  const parsed = parseInput(updateAssignmentSchema, input);
  if (!parsed.valid) return parsed.state;
  const { assignmentId, attachment, removeAttachment, dueAt, cutoffAt, maxGrade, title, instructions } = parsed.data;

  const authorization = await authorizeAssignment(assignmentId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course, assignment } = authorization.context;

  if (attachment && !attachment.path.startsWith(`${course.id}/${assignment.section_id}/`)) return INVALID_ATTACHMENT;

  const replacesAttachment = attachment !== null || removeAttachment;
  const { error } = await supabase
    .from("assignments")
    .update({
      title,
      instructions,
      due_at: dueAt,
      cutoff_at: cutoffAt,
      max_grade: maxGrade,
      ...(replacesAttachment
        ? { attachment_path: attachment?.path ?? null, attachment_name: attachment?.name ?? null }
        : {}),
    })
    .eq("id", assignmentId);
  if (error) {
    await removeStoredFiles(supabase, COURSE_MATERIALS_BUCKET, [attachment?.path ?? null]);
    return errorState("No pudimos guardar los cambios. Revisá los datos y probá de nuevo.");
  }

  await supabase.from("resources").update({ title }).eq("assignment_id", assignmentId);
  if (replacesAttachment) await removeStoredFiles(supabase, COURSE_MATERIALS_BUCKET, [assignment.attachment_path]);

  revalidateAssignment(course, assignmentId);
  return successState("Cambios guardados.");
}
