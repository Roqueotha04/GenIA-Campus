import { buildCourseHref, type CourseSummary } from "@/lib/courses/course-access";

type CourseLocation = Pick<CourseSummary, "level_slug" | "module_number">;

export function buildQuizManagerHref(course: CourseLocation): string {
  return `${buildCourseHref(course)}/gestionar/quizzes`;
}

export function buildQuizEditorHref(course: CourseLocation, quizId: string): string {
  return `${buildQuizManagerHref(course)}/${quizId}`;
}
