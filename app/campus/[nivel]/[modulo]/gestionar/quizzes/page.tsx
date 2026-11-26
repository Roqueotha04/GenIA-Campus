import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { QuizManagerView } from "@/components/quizzes/QuizManagerView";
import { requireProfile } from "@/lib/auth/current-profile";
import { buildCourseHref, findCourseByModule, getCourseAccess } from "@/lib/courses/course-access";
import { loadCourseQuizzes } from "@/lib/quizzes/quiz-queries";

interface QuizManagerPageProps {
  params: Promise<{ nivel: string; modulo: string }>;
}

export const metadata: Metadata = { title: "Cuestionarios" };

export default async function QuizManagerPage({ params }: QuizManagerPageProps) {
  const { nivel, modulo } = await params;
  const profile = await requireProfile();

  const course = await findCourseByModule(nivel, modulo);
  if (!course) notFound();

  const { canManage } = await getCourseAccess(course.id, profile);
  if (!canManage) redirect(buildCourseHref(course));

  const quizzes = await loadCourseQuizzes(course.id);
  return <QuizManagerView course={course} quizzes={quizzes} />;
}
