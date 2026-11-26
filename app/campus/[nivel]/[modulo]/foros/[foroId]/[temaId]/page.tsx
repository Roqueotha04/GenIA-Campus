import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { TopicThreadView } from "@/components/forums/TopicThreadView";
import { requireProfile } from "@/lib/auth/current-profile";
import { findLevel } from "@/lib/catalog";
import { buildCourseHref, findCourseByModule, getCourseAccess } from "@/lib/courses/course-access";
import { findCourseForum, loadTopicThread } from "@/lib/forums/forum-queries";

interface TopicPageProps {
  params: Promise<{ nivel: string; modulo: string; foroId: string; temaId: string }>;
}

export const metadata: Metadata = { title: "Tema del foro" };

export default async function TopicPage({ params }: TopicPageProps) {
  const { nivel, modulo, foroId, temaId } = await params;

  const course = await findCourseByModule(nivel, modulo);
  if (!course) notFound();

  const profile = await requireProfile();
  const { canManage, canView } = await getCourseAccess(course.id, profile);
  if (!canView) redirect(buildCourseHref(course));

  const forum = await findCourseForum(course.id, foroId);
  if (!forum) notFound();

  const thread = await loadTopicThread(forum.id, temaId, { profileId: profile.id, canManage });
  if (!thread) notFound();

  return (
    <TopicThreadView
      course={course}
      levelName={findLevel(nivel)?.name ?? course.level_slug}
      forum={forum}
      thread={thread}
      canPost={!profile.isGuest}
    />
  );
}
