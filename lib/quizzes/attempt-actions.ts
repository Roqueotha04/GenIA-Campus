"use server";

import { z } from "zod";
import { getCurrentProfile } from "@/lib/auth/current-profile";
import { getCourseAccess } from "@/lib/courses/course-access";
import { parseAnswers, scoreAnswers } from "@/lib/quiz-scoring";
import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { loadQuizWithAnswerKey } from "./quiz-queries";
import type { SubmitQuizAttemptResult } from "./quiz-review";
import { parseStoredQuestions } from "./stored-quiz";

const MAX_WRITTEN_ANSWER_LENGTH = 5000;

const quizIdSchema = z.string().uuid();

const failure = (message: string): SubmitQuizAttemptResult => ({ status: "error", message });

function hasOversizedWrittenAnswer(answers: unknown[]): boolean {
  return answers.some((answer) => typeof answer === "string" && answer.length > MAX_WRITTEN_ANSWER_LENGTH);
}

export async function submitQuizAttempt(quizId: string, answers: unknown): Promise<SubmitQuizAttemptResult> {
  if (!quizIdSchema.safeParse(quizId).success) {
    return failure("No pudimos identificar el cuestionario. Recargá la página y probá de nuevo.");
  }

  const profile = await getCurrentProfile();
  if (!profile) return failure("Tu sesión venció. Volvé a iniciar sesión y probá de nuevo.");

  const quiz = await loadQuizWithAnswerKey(quizId);
  if (!quiz) return failure("No encontramos ese cuestionario. Volvé al módulo y abrilo de nuevo.");

  const { canView, canManage } = await getCourseAccess(quiz.course_id, profile);
  if (!canView || (!quiz.is_published && !canManage)) {
    return failure("No tenés acceso a este cuestionario. Volvé al módulo y revisá que estés matriculado.");
  }

  const questions = parseStoredQuestions(quiz.questions);
  if (!questions || questions.length === 0) {
    return failure("Este cuestionario todavía no tiene preguntas. Avisale a tu docente.");
  }

  const rawAnswers = Array.isArray(answers) ? answers : [];
  const validAnswers = hasOversizedWrittenAnswer(rawAnswers)
    ? null
    : parseAnswers(JSON.stringify(rawAnswers), questions);
  if (!validAnswers) return failure("Tus respuestas no se pudieron leer. Recargá la página y volvé a intentarlo.");

  const activity = {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    passingScore: quiz.passing_score,
    questions,
  };
  const { score, total } = scoreAnswers(activity, validAnswers);
  const review = { questions, answers: validAnswers, passingScore: quiz.passing_score };

  if (canManage || profile.isGuest) return { status: "preview", review };

  const { error } = await createSupabaseAdminClient().from("quiz_attempts").insert({
    quiz_id: quiz.id,
    course_id: quiz.course_id,
    student_id: profile.id,
    answers: validAnswers,
    score,
    total,
  });
  if (error) return failure("No pudimos guardar tu intento. Probá de nuevo en unos segundos.");

  return { status: "saved", review };
}
