import "server-only";
import { errorState, type FormState } from "@/lib/forms/form-state";
import { authorizeCourse, type AuthorizedCourse } from "@/lib/teacher/course-authorization";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { QUIZ_COLUMNS, type StoredQuiz } from "./stored-quiz";

export interface AuthorizedQuiz extends AuthorizedCourse {
  quiz: StoredQuiz;
}

export type QuizAuthorization =
  | { allowed: true; context: AuthorizedQuiz }
  | { allowed: false; state: FormState };

const QUIZ_NOT_FOUND = errorState("No encontramos ese cuestionario. Recargá la página y probá de nuevo.");

export async function authorizeQuiz(quizId: string): Promise<QuizAuthorization> {
  const supabase = await createSupabaseServerClient();
  const { data: quiz } = await supabase.from("quizzes").select(QUIZ_COLUMNS).eq("id", quizId).maybeSingle();
  if (!quiz) return { allowed: false, state: QUIZ_NOT_FOUND };

  const authorization = await authorizeCourse(quiz.course_id);
  if (!authorization.allowed) return authorization;

  return { allowed: true, context: { ...authorization.context, quiz } };
}
