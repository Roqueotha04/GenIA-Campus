import { Breadcrumb } from "@/components/campus/Breadcrumb";
import { buildCourseHref, type CourseSummary } from "@/lib/courses/course-access";

interface ForumBreadcrumbTrailItem {
  label: string;
  href?: string;
}

interface ForumBreadcrumbProps {
  course: CourseSummary;
  levelName: string;
  trail: ForumBreadcrumbTrailItem[];
}

export function ForumBreadcrumb({ course, levelName, trail }: ForumBreadcrumbProps) {
  return (
    <Breadcrumb
      items={[
        { label: "Campus", href: "/campus" },
        { label: levelName, href: `/campus/${course.level_slug}` },
        { label: `Módulo ${course.module_number}`, href: buildCourseHref(course) },
        ...trail,
      ]}
    />
  );
}
