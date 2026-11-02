import type { CourseModule, Level } from "@/data/schemas";
import { buildModuleHref } from "@/lib/catalog";

export function buildModuleBreadcrumbItems(
  level: Level,
  courseModule: CourseModule,
  currentLabel: string,
) {
  return [
    { label: "Campus", href: "/campus" },
    { label: level.name, href: `/campus/${level.slug}` },
    { label: `Módulo ${courseModule.number}`, href: buildModuleHref(level, courseModule) },
    { label: currentLabel },
  ];
}
