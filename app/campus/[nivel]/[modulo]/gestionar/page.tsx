import { notFound, redirect } from "next/navigation";
import { CourseManagement } from "@/components/teacher/CourseManagement";
import { requireProfile } from "@/lib/auth/current-profile";
import { buildCourseHref, findCourseByModule, getCourseAccess } from "@/lib/courses/course-access";
import { loadCourseManagement } from "@/lib/teacher/load-course-management";

interface ManageCoursePageProps {
  params: Promise<{ nivel: string; modulo: string }>;
}

export default async function ManageCoursePage({ params }: ManageCoursePageProps) {
  const { nivel, modulo } = await params;
  const profile = await requireProfile();

  const course = await findCourseByModule(nivel, modulo);
  if (!course) notFound();

  const { canManage } = await getCourseAccess(course.id, profile);
  if (!canManage) redirect(buildCourseHref(course));

  const data = await loadCourseManagement(course);
  return <CourseManagement course={course} data={data} />;
}
