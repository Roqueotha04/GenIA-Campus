import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { QUIZ_COLUMNS, type StoredQuiz } from "./stored-quiz";

export async function loadCourseQuizzes(courseId: string): Promise<StoredQuiz[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("quizzes")
    .select(QUIZ_COLUMNS)
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function loadManagedQuiz(courseId: string, quizId: string): Promise<StoredQuiz | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("quizzes")
    .select(QUIZ_COLUMNS)
    .eq("id", quizId)
    .eq("course_id", courseId)
    .maybeSingle();
  return data;
}

export async function loadQuizWithAnswerKey(quizId: string): Promise<StoredQuiz | null> {
  const { data } = await createSupabaseAdminClient()
    .from("quizzes")
    .select(QUIZ_COLUMNS)
    .eq("id", quizId)
    .maybeSingle();
  return data;
}

export async function loadLatestAttemptAnswers(quizId: string, studentId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("quiz_attempts")
    .select("answers")
    .eq("quiz_id", quizId)
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.answers ?? null;
}
