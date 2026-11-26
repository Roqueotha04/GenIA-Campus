import { buildCourseHref, type CourseSummary } from "@/lib/courses/course-access";
import { Breadcrumb } from "@/components/campus/Breadcrumb";

interface CourseBreadcrumbProps {
  course: CourseSummary;
  levelName: string;
  currentLabel?: string;
}

export function CourseBreadcrumb({ course, levelName, currentLabel }: CourseBreadcrumbProps) {
  const moduleLabel = `Módulo ${course.module_number}`;
  const items = [
    { label: "Campus", href: "/campus" },
    { label: levelName, href: `/campus/${course.level_slug}` },
    currentLabel
      ? { label: moduleLabel, href: buildCourseHref(course) }
      : { label: moduleLabel },
  ];

  return <Breadcrumb items={currentLabel ? [...items, { label: currentLabel }] : items} />;
}
