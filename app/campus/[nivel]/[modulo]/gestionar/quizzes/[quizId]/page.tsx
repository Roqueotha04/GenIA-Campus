import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { QuizEditorView } from "@/components/quizzes/QuizEditorView";
import { requireProfile } from "@/lib/auth/current-profile";
import { buildCourseHref, findCourseByModule, getCourseAccess } from "@/lib/courses/course-access";
import { isQuizId } from "@/lib/quizzes/quiz-id";
import { loadQuizAttemptSummaries } from "@/lib/quizzes/quiz-attempt-summaries";
import { loadManagedQuiz } from "@/lib/quizzes/quiz-queries";
import { parseStoredQuestions } from "@/lib/quizzes/stored-quiz";

interface QuizEditorPageProps {
  params: Promise<{ nivel: string; modulo: string; quizId: string }>;
}

export const metadata: Metadata = { title: "Editar cuestionario" };

export default async function QuizEditorPage({ params }: QuizEditorPageProps) {
  const { nivel, modulo, quizId } = await params;
  if (!isQuizId(quizId)) notFound();

  const profile = await requireProfile();
  const course = await findCourseByModule(nivel, modulo);
  if (!course) notFound();

  const { canManage } = await getCourseAccess(course.id, profile);
  if (!canManage) redirect(buildCourseHref(course));

  const quiz = await loadManagedQuiz(course.id, quizId);
  if (!quiz) notFound();

  const questions = parseStoredQuestions(quiz.questions) ?? [];
  const summaries = await loadQuizAttemptSummaries(quiz.id, quiz.passing_score);

  return <QuizEditorView course={course} quiz={quiz} questions={questions} summaries={summaries} />;
}
