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
      className="group flex flex-col border border-line bg-surface p-6 transition-colors hover:border-navy"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-muted">
        {levelName} · Módulo {course.module_number}
      </p>
      <h3 className="mt-4 font-heading text-xl font-semibold tracking-tight text-foreground">
        {course.title}
      </h3>
      <div className="mt-8 flex flex-1 items-end justify-between gap-4">
        <p className="flex items-center gap-2 text-sm text-foreground">
          <StatusDot tone={course.is_published ? "available" : "empty"} />
          {course.is_published ? "Publicado" : "Borrador"}
        </p>
        <ArrowRightIcon className="h-5 w-5 shrink-0 text-foreground transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
