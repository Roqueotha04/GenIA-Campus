import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/current-profile";
import { findLevel } from "@/lib/catalog";
import {
  getCourseSections,
  listCourseNotices,
  listCourseTeacherNames,
} from "@/lib/course-content/course-content-queries";
import { getCourseAccess, type CourseSummary } from "@/lib/courses/course-access";
import { CourseEnrollmentGate } from "./CourseEnrollmentGate";
import { CourseView } from "./CourseView";

const RECENT_NOTICES_LIMIT = 3;

export async function CourseModuleContent({ course }: { course: CourseSummary }) {
  const profile = await requireProfile();
  const access = await getCourseAccess(course.id, profile);
  if (!course.is_published && !access.canManage) notFound();

  const levelName = findLevel(course.level_slug)?.name ?? course.level_slug;

  if (!access.canView) {
    const teacherNames = await listCourseTeacherNames(course.id);
    return <CourseEnrollmentGate course={course} levelName={levelName} teacherNames={teacherNames} />;
  }

  const [sections, recentNotices] = await Promise.all([
    getCourseSections(course),
    listCourseNotices(course.id, RECENT_NOTICES_LIMIT),
  ]);

  return (
    <CourseView
      course={course}
      levelName={levelName}
      canManage={access.canManage}
      sections={sections}
      recentNotices={recentNotices}
    />
  );
}
