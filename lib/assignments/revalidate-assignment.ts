import "server-only";
import { revalidatePath } from "next/cache";
import { buildCourseAssignmentHref } from "@/lib/course-content/course-routes";
import type { CourseSummary } from "@/lib/courses/course-access";
import { revalidateCourse } from "@/lib/teacher/revalidate-course";

export function revalidateAssignment(
  course: Pick<CourseSummary, "level_slug" | "module_number">,
  assignmentId: string,
): void {
  revalidateCourse(course);
  revalidatePath(buildCourseAssignmentHref(course, assignmentId));
}
