import "server-only";
import { questionSchema, type Question } from "@/data/schemas";
import type { SupabaseServerClient } from "@/lib/teacher/course-authorization";
import type { StoredQuiz } from "./stored-quiz";

export async function saveQuestions(
  supabase: SupabaseServerClient,
  quiz: StoredQuiz,
  questions: Question[],
): Promise<boolean> {
  const validation = questionSchema.array().safeParse(questions);
  if (!validation.success) return false;

  const questionCount = validation.data.length;
  const { error } = await supabase
    .from("quizzes")
    .update({
      questions: validation.data,
      passing_score: Math.max(1, Math.min(quiz.passing_score, questionCount)),
      is_published: quiz.is_published && questionCount > 0,
    })
    .eq("id", quiz.id);

  return !error;
}
