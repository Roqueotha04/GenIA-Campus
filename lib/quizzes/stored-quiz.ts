import "server-only";
import { questionSchema, type Question } from "@/data/schemas";
import type { TableRow } from "@/types/database";

export const QUIZ_COLUMNS = "id, course_id, title, description, passing_score, questions, is_published, updated_at";

export type StoredQuiz = Pick<
  TableRow<"quizzes">,
  "id" | "course_id" | "title" | "description" | "passing_score" | "questions" | "is_published" | "updated_at"
>;

export function parseStoredQuestions(rawQuestions: StoredQuiz["questions"]): Question[] | null {
  const parsed = questionSchema.array().safeParse(rawQuestions);
  return parsed.success ? parsed.data : null;
}
