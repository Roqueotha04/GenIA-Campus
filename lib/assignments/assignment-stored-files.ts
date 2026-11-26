import "server-only";
import { COURSE_MATERIALS_BUCKET, SUBMISSIONS_BUCKET } from "@/lib/storage/storage-buckets";
import type { SupabaseServerClient } from "@/lib/teacher/course-authorization";
import { removeStoredFiles } from "./remove-stored-files";

export interface AssignmentStoredFiles {
  attachmentPaths: Array<string | null>;
  submissionPaths: Array<string | null>;
}

export async function collectAssignmentStoredFiles(
  supabase: SupabaseServerClient,
  assignmentIds: string[],
): Promise<AssignmentStoredFiles> {
  if (assignmentIds.length === 0) return { attachmentPaths: [], submissionPaths: [] };

  const [{ data: assignments }, { data: submissions }] = await Promise.all([
    supabase.from("assignments").select("attachment_path").in("id", assignmentIds),
    supabase.from("submissions").select("file_path").in("assignment_id", assignmentIds),
  ]);

  return {
    attachmentPaths: (assignments ?? []).map((assignment) => assignment.attachment_path),
    submissionPaths: (submissions ?? []).map((submission) => submission.file_path),
  };
}

export async function removeAssignmentStoredFiles(
  supabase: SupabaseServerClient,
  { attachmentPaths, submissionPaths }: AssignmentStoredFiles,
): Promise<void> {
  await Promise.all([
    removeStoredFiles(supabase, COURSE_MATERIALS_BUCKET, attachmentPaths),
    removeStoredFiles(supabase, SUBMISSIONS_BUCKET, submissionPaths),
  ]);
}
