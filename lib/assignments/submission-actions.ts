"use server";

import { errorState, successState, type FormState } from "@/lib/forms/form-state";
import { MAX_UPLOAD_BYTES, SUBMISSIONS_BUCKET, buildSubmissionPath } from "@/lib/storage/storage-buckets";
import { parseInput } from "@/lib/teacher/parse-form";
import { authorizeStudent, authorizeSubmissionCourse } from "./assignment-authorization";
import {
  gradeSubmissionSchema,
  submitAssignmentSchema,
  type GradeSubmissionInput,
  type SubmitAssignmentInput,
} from "./assignment-schemas";
import { getClosedMessage } from "./assignment-window";
import { hasAcceptedExtension } from "./file-rules";
import { removeStoredFiles } from "./remove-stored-files";
import { revalidateAssignment } from "./revalidate-assignment";

export type PreparedSubmissionUpload =
  | { prepared: true; path: string; token: string }
  | { prepared: false; message: string };

const MAX_UPLOAD_MEGABYTES = MAX_UPLOAD_BYTES / (1024 * 1024);

export async function prepareSubmissionUpload(
  assignmentId: string,
  fileName: string,
  sizeBytes: number,
): Promise<PreparedSubmissionUpload> {
  if (!hasAcceptedExtension(fileName)) {
    return { prepared: false, message: "Ese tipo de archivo no está permitido. Subí un PDF, Office, imagen, ZIP o texto." };
  }
  if (sizeBytes > MAX_UPLOAD_BYTES) {
    return { prepared: false, message: `El archivo supera los ${MAX_UPLOAD_MEGABYTES} MB. Comprimilo o subí una versión más liviana.` };
  }

  const authorization = await authorizeStudent(assignmentId);
  if (!authorization.allowed) return { prepared: false, message: authorization.state.message };
  const { supabase, course, assignment, profile } = authorization.context;

  const closedMessage = getClosedMessage(assignment);
  if (closedMessage) return { prepared: false, message: closedMessage };

  const path = buildSubmissionPath(course.id, assignmentId, profile.id, fileName);
  const { data, error } = await supabase.storage.from(SUBMISSIONS_BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    return { prepared: false, message: "No pudimos preparar la subida. Probá de nuevo en unos segundos." };
  }

  return { prepared: true, path, token: data.token };
}

export async function submitAssignment(input: SubmitAssignmentInput): Promise<FormState> {
  const parsed = parseInput(submitAssignmentSchema, input);
  if (!parsed.valid) return parsed.state;
  const { assignmentId, textAnswer, linkUrl, file } = parsed.data;

  const authorization = await authorizeStudent(assignmentId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course, assignment, profile } = authorization.context;

  const discardNewFile = () => removeStoredFiles(supabase, SUBMISSIONS_BUCKET, [file?.path ?? null]);

  const closedMessage = getClosedMessage(assignment);
  if (closedMessage) {
    await discardNewFile();
    return errorState(closedMessage);
  }

  if (file && !file.path.startsWith(`${course.id}/${assignmentId}/${profile.id}/`)) {
    return errorState("El archivo no es válido. Subilo de nuevo.");
  }

  const { data: existing } = await supabase
    .from("submissions")
    .select("file_path, file_name")
    .eq("assignment_id", assignmentId)
    .eq("student_id", profile.id)
    .maybeSingle();

  const filePath = file?.path ?? existing?.file_path ?? null;
  const fileName = file?.name ?? existing?.file_name ?? null;
  if (!textAnswer && !linkUrl && !filePath) {
    return errorState("Escribí una respuesta, pegá un enlace o subí un archivo para poder entregar.");
  }

  const { error } = await supabase.from("submissions").upsert(
    {
      assignment_id: assignmentId,
      student_id: profile.id,
      text_answer: textAnswer,
      link_url: linkUrl,
      file_path: filePath,
      file_name: fileName,
    },
    { onConflict: "assignment_id,student_id" },
  );
  if (error) {
    await discardNewFile();
    return errorState("No pudimos guardar tu entrega. Revisá tu conexión y probá de nuevo.");
  }

  if (file && existing?.file_path && existing.file_path !== file.path) {
    await removeStoredFiles(supabase, SUBMISSIONS_BUCKET, [existing.file_path]);
  }

  revalidateAssignment(course, assignmentId);
  return successState("Entrega guardada.");
}

export async function gradeSubmission(input: GradeSubmissionInput): Promise<FormState> {
  const parsed = parseInput(gradeSubmissionSchema, input);
  if (!parsed.valid) return parsed.state;
  const { submissionId, grade, feedback } = parsed.data;

  const authorization = await authorizeSubmissionCourse(submissionId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course, assignment } = authorization.context;

  if (grade > assignment.max_grade) {
    return errorState(`La nota no puede superar el máximo de ${assignment.max_grade}. Corregila y guardá de nuevo.`);
  }

  const { error } = await supabase.from("submissions").update({ grade, feedback }).eq("id", submissionId);
  if (error) return errorState("No pudimos guardar la corrección. Probá de nuevo en unos segundos.");

  revalidateAssignment(course, assignment.id);
  return successState("Corrección guardada.");
}
