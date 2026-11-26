import { buildCourseHref, type CourseSummary } from "@/lib/courses/course-access";

type CourseLocation = Pick<CourseSummary, "level_slug" | "module_number">;

export function buildCourseNoticesHref(course: CourseLocation): string {
  return `${buildCourseHref(course)}/avisos`;
}

export function buildCourseGameHref(course: CourseLocation, gameSlug: string): string {
  return `${buildCourseHref(course)}/juegos/${gameSlug}`;
}

export function buildCourseQuizHref(course: CourseLocation, quizId: string): string {
  return `${buildCourseHref(course)}/quiz/${quizId}`;
}

export function buildCourseAssignmentHref(course: CourseLocation, assignmentId: string): string {
  return `${buildCourseHref(course)}/entregas/${assignmentId}`;
}

export function buildCourseManageHref(course: CourseLocation): string {
  return `${buildCourseHref(course)}/gestionar`;
}
