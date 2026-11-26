import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CourseGameView } from "@/components/course/CourseGameView";
import { findRegisteredGame } from "@/data/games";
import { requireProfile } from "@/lib/auth/current-profile";
import { findLevel } from "@/lib/catalog";
import { hasCourseGame } from "@/lib/course-content/course-content-queries";
import { buildCourseHref, findCourseByModule, getCourseAccess } from "@/lib/courses/course-access";

interface CourseGamePageProps {
  params: Promise<{ nivel: string; modulo: string; slug: string }>;
}

export async function generateMetadata({ params }: CourseGamePageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: findRegisteredGame(slug)?.title ?? "Juego" };
}

export default async function CourseGamePage({ params }: CourseGamePageProps) {
  const { nivel, modulo, slug } = await params;

  const course = await findCourseByModule(nivel, modulo);
  const game = findRegisteredGame(slug);
  if (!course || !game) notFound();

  const profile = await requireProfile();
  const access = await getCourseAccess(course.id, profile);
  if (!access.canView) redirect(buildCourseHref(course));
  if (!(await hasCourseGame(course.id, slug))) notFound();

  return (
    <CourseGameView
      course={course}
      levelName={findLevel(nivel)?.name ?? nivel}
      game={game}
    />
  );
}
