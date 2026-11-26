import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ForumView } from "@/components/forums/ForumView";
import { requireProfile } from "@/lib/auth/current-profile";
import { findLevel } from "@/lib/catalog";
import { buildCourseHref, findCourseByModule, getCourseAccess } from "@/lib/courses/course-access";
import { findCourseForum, listForumTopics } from "@/lib/forums/forum-queries";

interface ForumPageProps {
  params: Promise<{ nivel: string; modulo: string; foroId: string }>;
}

export const metadata: Metadata = { title: "Foro" };

export default async function ForumPage({ params }: ForumPageProps) {
  const { nivel, modulo, foroId } = await params;

  const course = await findCourseByModule(nivel, modulo);
  if (!course) notFound();

  const profile = await requireProfile();
  const { canManage, canView } = await getCourseAccess(course.id, profile);
  if (!canView) redirect(buildCourseHref(course));

  const forum = await findCourseForum(course.id, foroId);
  if (!forum) notFound();

  return (
    <ForumView
      course={course}
      levelName={findLevel(nivel)?.name ?? course.level_slug}
      forum={forum}
      topics={await listForumTopics(forum.id)}
      canPost={!profile.isGuest}
      canManage={canManage}
    />
  );
}
