import "server-only";
import { revalidatePath } from "next/cache";
import { buildCourseForumHref } from "@/lib/course-content/course-routes";
import type { CourseSummary } from "@/lib/courses/course-access";
import { revalidateCourse } from "@/lib/teacher/revalidate-course";

export function revalidateForum(
  course: Pick<CourseSummary, "level_slug" | "module_number">,
  forumId: string,
): void {
  revalidateCourse(course);
  revalidatePath(buildCourseForumHref(course, forumId), "layout");
}
