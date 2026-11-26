import "server-only";
import { createSignedDownloadUrls } from "@/lib/storage/signed-downloads";
import { COURSE_MATERIALS_BUCKET, SUBMISSIONS_BUCKET } from "@/lib/storage/storage-buckets";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import {
  ASSIGNMENT_COLUMNS,
  SUBMISSION_COLUMNS,
  type AssignmentRecord,
  type SubmissionRecord,
} from "./assignment-types";

export interface SubmissionView extends SubmissionRecord {
  fileUrl: string | null;
}

export interface RosterEntry {
  studentId: string;
  name: string;
  email: string;
  submission: SubmissionView | null;
}

export async function findCourseAssignment(
  courseId: string,
  assignmentId: string,
): Promise<AssignmentRecord | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("assignments")
    .select(ASSIGNMENT_COLUMNS)
    .eq("id", assignmentId)
    .eq("course_id", courseId)
    .maybeSingle();
  return data;
}

export async function findAttachmentUrl(assignment: AssignmentRecord): Promise<string | null> {
  if (!assignment.attachment_path) return null;
  const urls = await createSignedDownloadUrls(COURSE_MATERIALS_BUCKET, [
    { path: assignment.attachment_path, displayName: assignment.attachment_name ?? assignment.title },
  ]);
  return urls.get(assignment.attachment_path) ?? null;
}

async function attachFileUrls(submissions: SubmissionRecord[]): Promise<SubmissionView[]> {
  const files = submissions.flatMap((submission) =>
    submission.file_path
      ? [{ path: submission.file_path, displayName: submission.file_name ?? "entrega" }]
      : [],
  );
  const urls = await createSignedDownloadUrls(SUBMISSIONS_BUCKET, files);
  return submissions.map((submission) => ({
    ...submission,
    fileUrl: submission.file_path ? (urls.get(submission.file_path) ?? null) : null,
  }));
}

export async function findStudentSubmission(
  assignmentId: string,
  studentId: string,
): Promise<SubmissionView | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("submissions")
    .select(SUBMISSION_COLUMNS)
    .eq("assignment_id", assignmentId)
    .eq("student_id", studentId)
    .maybeSingle();
  if (!data) return null;
  const [view] = await attachFileUrls([data]);
  return view;
}

export async function loadRoster(courseId: string, assignmentId: string): Promise<RosterEntry[]> {
  const supabase = await createSupabaseServerClient();
  const [{ data: enrollments }, { data: submissions }] = await Promise.all([
    supabase.from("enrollments").select("student_id").eq("course_id", courseId),
    supabase.from("submissions").select(SUBMISSION_COLUMNS).eq("assignment_id", assignmentId),
  ]);

  const studentIds = (enrollments ?? []).map((enrollment) => enrollment.student_id);
  if (studentIds.length === 0) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", studentIds);

  const submissionViews = await attachFileUrls(submissions ?? []);
  const submissionByStudent = new Map(submissionViews.map((submission) => [submission.student_id, submission]));

  return (profiles ?? [])
    .map((profile) => ({
      studentId: profile.id,
      name: profile.full_name,
      email: profile.email,
      submission: submissionByStudent.get(profile.id) ?? null,
    }))
    .sort((first, second) => first.name.localeCompare(second.name, "es"));
}
