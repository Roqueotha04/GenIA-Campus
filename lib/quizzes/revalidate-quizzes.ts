import "server-only";
import { revalidatePath } from "next/cache";
import { buildCourseHref, type CourseSummary } from "@/lib/courses/course-access";
import { revalidateCourse } from "@/lib/teacher/revalidate-course";
import { buildQuizManagerHref } from "./quiz-routes";

type CourseLocation = Pick<CourseSummary, "level_slug" | "module_number">;

export function revalidateQuizzes(course: CourseLocation): void {
  revalidateCourse(course);
  revalidatePath(buildQuizManagerHref(course), "layout");
  revalidatePath(`${buildCourseHref(course)}/quiz`, "layout");
}
