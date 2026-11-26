import type { TableRow } from "@/types/database";

export const ASSIGNMENT_COLUMNS =
  "id, section_id, course_id, title, instructions, attachment_path, attachment_name, due_at, cutoff_at, max_grade";

export type AssignmentRecord = Pick<
  TableRow<"assignments">,
  | "id"
  | "section_id"
  | "course_id"
  | "title"
  | "instructions"
  | "attachment_path"
  | "attachment_name"
  | "due_at"
  | "cutoff_at"
  | "max_grade"
>;

export const SUBMISSION_COLUMNS =
  "id, assignment_id, student_id, text_answer, link_url, file_path, file_name, submitted_at, grade, feedback, graded_at";

export type SubmissionRecord = Pick<
  TableRow<"submissions">,
  | "id"
  | "assignment_id"
  | "student_id"
  | "text_answer"
  | "link_url"
  | "file_path"
  | "file_name"
  | "submitted_at"
  | "grade"
  | "feedback"
  | "graded_at"
>;

export type ManagedAssignment = Pick<
  AssignmentRecord,
  "id" | "section_id" | "title" | "instructions" | "attachment_name" | "due_at" | "cutoff_at" | "max_grade"
> & {
  href: string;
  submittedCount: number;
  enrolledCount: number;
};
