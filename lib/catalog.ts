import { levels } from "@/data/levels";
import type { CourseClass, CourseModule, Level } from "@/data/schemas";

const FEATURED_LEVEL_SLUG = "adultos";

export const levelsWithFeaturedFirst: Level[] = [
  ...levels.filter((level) => level.slug === FEATURED_LEVEL_SLUG),
  ...levels.filter((level) => level.slug !== FEATURED_LEVEL_SLUG),
];

export function findLevel(slug: string): Level | undefined {
  return levels.find((level) => level.slug === slug);
}

export function findModule(level: Level, rawNumber: string): CourseModule | undefined {
  const number = Number(rawNumber);
  return level.modules.find((courseModule) => courseModule.number === number);
}

export function findClass(courseModule: CourseModule, rawNumber: string): CourseClass | undefined {
  const number = Number(rawNumber);
  return courseModule.classes?.find((courseClass) => courseClass.number === number);
}

export function findClassContext(levelSlug: string, moduleNumber: string, classNumber: string) {
  const level = findLevel(levelSlug);
  const courseModule = level && findModule(level, moduleNumber);
  const courseClass = courseModule && findClass(courseModule, classNumber);
  if (!level || !courseModule || !courseClass) return undefined;
  return { level, courseModule, courseClass };
}

export function buildModuleHref(level: Level, courseModule: CourseModule): string {
  return `/campus/${level.slug}/${courseModule.number}`;
}

export function hasClasses(courseModule: CourseModule): boolean {
  return (courseModule.classes?.length ?? 0) > 0;
}

export function countModulesWithClasses(level: Level): number {
  return level.modules.filter(hasClasses).length;
}

export function formatNumber(number: number): string {
  return String(number).padStart(2, "0");
}
