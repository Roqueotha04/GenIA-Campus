import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { QuizTakeView } from "@/components/quizzes/QuizTakeView";
import { requireProfile } from "@/lib/auth/current-profile";
import { findLevel } from "@/lib/catalog";
import { buildCourseHref, findCourseByModule, getCourseAccess } from "@/lib/courses/course-access";
import { isQuizId } from "@/lib/quizzes/quiz-id";
import { loadQuizForTaking } from "@/lib/quizzes/load-quiz-for-taking";

interface QuizPageProps {
  params: Promise<{ nivel: string; modulo: string; quizId: string }>;
}

export const metadata: Metadata = { title: "Cuestionario" };

export default async function QuizPage({ params }: QuizPageProps) {
  const { nivel, modulo, quizId } = await params;
  if (!isQuizId(quizId)) notFound();

  const course = await findCourseByModule(nivel, modulo);
  if (!course) notFound();

  const profile = await requireProfile();
  const { canView, canManage } = await getCourseAccess(course.id, profile);
  if (!canView) redirect(buildCourseHref(course));

  const quiz = await loadQuizForTaking({
    courseId: course.id,
    quizId,
    studentId: profile.id,
    canManage,
  });
  if (!quiz) notFound();

  return (
    <QuizTakeView
      course={course}
      levelName={findLevel(nivel)?.name ?? nivel}
      quizId={quizId}
      quiz={quiz}
      isPreview={canManage}
    />
  );
}
