import "server-only";
import { revalidatePath } from "next/cache";
import { buildCourseHref, type CourseSummary } from "@/lib/courses/course-access";

type CourseLocation = Pick<CourseSummary, "level_slug" | "module_number">;

export function buildManagementHref(course: CourseLocation): string {
  return `${buildCourseHref(course)}/gestionar`;
}

export function revalidateCourse(course: CourseLocation): void {
  revalidatePath(buildCourseHref(course));
  revalidatePath(buildManagementHref(course));
}
