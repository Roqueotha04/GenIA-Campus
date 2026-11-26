"use server";

import { errorState, successState, type FormState } from "@/lib/forms/form-state";
import { COURSE_MATERIALS_BUCKET, SUBMISSIONS_BUCKET } from "@/lib/storage/storage-buckets";
import { authorizeSection } from "@/lib/teacher/course-authorization";
import { parseForm, parseInput } from "@/lib/teacher/parse-form";
import { authorizeAssignment } from "./assignment-authorization";
import {
  assignmentIdSchema,
  createAssignmentSchema,
  updateAssignmentSchema,
  type CreateAssignmentInput,
  type UpdateAssignmentInput,
} from "./assignment-schemas";
import { removeStoredFiles } from "./remove-stored-files";
import { revalidateAssignment } from "./revalidate-assignment";

const INVALID_ATTACHMENT = errorState("El adjunto no es válido. Subilo de nuevo.");

export async function createAssignment(input: CreateAssignmentInput): Promise<FormState> {
  const parsed = parseInput(createAssignmentSchema, input);
  if (!parsed.valid) return parsed.state;
  const { sectionId, attachment, dueAt, maxGrade, allowLate, title, instructions } = parsed.data;

  const authorization = await authorizeSection(sectionId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  if (attachment && !attachment.path.startsWith(`${course.id}/${sectionId}/`)) return INVALID_ATTACHMENT;

  const { data: created, error } = await supabase
    .from("assignments")
    .insert({
      section_id: sectionId,
      title,
      instructions,
      attachment_path: attachment?.path ?? null,
      attachment_name: attachment?.name ?? null,
      due_at: dueAt,
      max_grade: maxGrade,
      allow_late: allowLate,
    })
    .select("id")
    .single();
  if (error || !created) {
    await removeStoredFiles(supabase, COURSE_MATERIALS_BUCKET, [attachment?.path ?? null]);
    return errorState("No pudimos crear la entrega. Revisá los datos y probá de nuevo.");
  }

  revalidateAssignment(course, created.id);
  return successState("Entrega creada.");
}

export async function updateAssignment(input: UpdateAssignmentInput): Promise<FormState> {
  const parsed = parseInput(updateAssignmentSchema, input);
  if (!parsed.valid) return parsed.state;
  const { assignmentId, attachment, removeAttachment, dueAt, maxGrade, allowLate, title, instructions } = parsed.data;

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
      max_grade: maxGrade,
      allow_late: allowLate,
      ...(replacesAttachment
        ? { attachment_path: attachment?.path ?? null, attachment_name: attachment?.name ?? null }
        : {}),
    })
    .eq("id", assignmentId);
  if (error) {
    await removeStoredFiles(supabase, COURSE_MATERIALS_BUCKET, [attachment?.path ?? null]);
    return errorState("No pudimos guardar los cambios. Revisá los datos y probá de nuevo.");
  }

  if (replacesAttachment) await removeStoredFiles(supabase, COURSE_MATERIALS_BUCKET, [assignment.attachment_path]);

  revalidateAssignment(course, assignmentId);
  return successState("Cambios guardados.");
}

export async function deleteAssignmentAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(assignmentIdSchema, formData);
  if (!parsed.valid) return parsed.state;
  const { assignmentId } = parsed.data;

  const authorization = await authorizeAssignment(assignmentId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course, assignment } = authorization.context;

  const { data: submissions } = await supabase
    .from("submissions")
    .select("file_path")
    .eq("assignment_id", assignmentId);

  const { error } = await supabase.from("assignments").delete().eq("id", assignmentId);
  if (error) return errorState("No pudimos eliminar la entrega. Probá de nuevo en unos segundos.");

  await removeStoredFiles(supabase, COURSE_MATERIALS_BUCKET, [assignment.attachment_path]);
  await removeStoredFiles(
    supabase,
    SUBMISSIONS_BUCKET,
    (submissions ?? []).map((submission) => submission.file_path),
  );

  revalidateAssignment(course, assignmentId);
  return successState("Entrega eliminada.");
}
