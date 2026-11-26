import { levels } from "@/data/levels";
import type { SelectOption } from "@/components/ui/SelectField";

export interface CourseModuleChoice {
  levelSlug: string;
  moduleNumber: number;
  label: string;
}

const MODULE_KEY_SEPARATOR = ":";

function buildModuleLabel(levelName: string, moduleNumber: number): string {
  return `${levelName} · Módulo ${moduleNumber}`;
}

function buildModuleKey(levelSlug: string, moduleNumber: number): string {
  return `${levelSlug}${MODULE_KEY_SEPARATOR}${moduleNumber}`;
}

const courseModuleChoices: CourseModuleChoice[] = levels.flatMap((level) =>
  level.modules.map((courseModule) => ({
    levelSlug: level.slug,
    moduleNumber: courseModule.number,
    label: buildModuleLabel(level.name, courseModule.number),
  })),
);

export const courseModuleOptions: SelectOption[] = courseModuleChoices.map((choice) => ({
  value: buildModuleKey(choice.levelSlug, choice.moduleNumber),
  label: choice.label,
}));

export function findCourseModuleChoice(moduleKey: string): CourseModuleChoice | undefined {
  return courseModuleChoices.find(
    (choice) => buildModuleKey(choice.levelSlug, choice.moduleNumber) === moduleKey,
  );
}

export function describeCourseModule(levelSlug: string, moduleNumber: number): string {
  const choice = courseModuleChoices.find(
    (candidate) => candidate.levelSlug === levelSlug && candidate.moduleNumber === moduleNumber,
  );
  return choice?.label ?? `${levelSlug} · Módulo ${moduleNumber}`;
}
