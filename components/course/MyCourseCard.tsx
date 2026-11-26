import Link from "next/link";
import { findLevel } from "@/lib/catalog";
import { buildCourseHref, type CourseSummary } from "@/lib/courses/course-access";
import { ArrowRightIcon } from "@/components/ui/icons";
import { StatusDot } from "@/components/ui/StatusDot";

export function MyCourseCard({ course }: { course: CourseSummary }) {
  const levelName = findLevel(course.level_slug)?.name ?? course.level_slug;

  return (
    <Link
      href={buildCourseHref(course)}
      className="group flex flex-col border border-line bg-surface p-4 transition-colors hover:border-navy"
    >
      <p className="text-xs text-muted">
        {levelName} · Módulo {course.module_number}
      </p>
      <h3 className="mt-1 font-heading text-base font-semibold text-foreground group-hover:text-primary">
        {course.title}
      </h3>
      <div className="mt-4 flex flex-1 items-end justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-muted">
          <StatusDot tone={course.is_published ? "available" : "empty"} />
          {course.is_published ? "Publicado" : "Borrador"}
        </p>
        <ArrowRightIcon className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" />
      </div>
    </Link>
  );
}
