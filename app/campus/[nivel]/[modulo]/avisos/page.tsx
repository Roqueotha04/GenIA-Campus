import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { NoticesView } from "@/components/campus/NoticesView";
import { CourseNoticesView } from "@/components/course/CourseNoticesView";
import { requireProfile } from "@/lib/auth/current-profile";
import { findLevel, findModule } from "@/lib/catalog";
import { listCourseNotices } from "@/lib/course-content/course-content-queries";
import { buildCourseHref, findCourseByModule, getCourseAccess } from "@/lib/courses/course-access";

interface NoticesPageProps {
  params: Promise<{ nivel: string; modulo: string }>;
}

export const metadata: Metadata = { title: "Avisos" };

export default async function NoticesPage({ params }: NoticesPageProps) {
  const { nivel, modulo } = await params;
  const level = findLevel(nivel);

  const course = await findCourseByModule(nivel, modulo);
  if (course) {
    const profile = await requireProfile();
    const access = await getCourseAccess(course.id, profile);
    if (!access.canView) redirect(buildCourseHref(course));

    const notices = await listCourseNotices(course.id);
    return (
      <CourseNoticesView
        course={course}
        levelName={level?.name ?? course.level_slug}
        notices={notices}
      />
    );
  }

  const courseModule = level && findModule(level, modulo);
  if (!level || !courseModule) notFound();

  return <NoticesView level={level} courseModule={courseModule} />;
}
