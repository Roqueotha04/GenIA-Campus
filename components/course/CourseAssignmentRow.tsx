import Link from "next/link";
import type { CourseAssignmentItem } from "@/lib/course-content/course-content-types";
import { ArrowRightIcon, FileIcon } from "@/components/ui/icons";

export function CourseAssignmentRow({ assignment }: { assignment: CourseAssignmentItem }) {
  return (
    <Link href={assignment.href} className="group flex items-center gap-4 py-4">
      <FileIcon className="h-6 w-6 shrink-0 text-primary" />
      <span className="flex-1">
        <span className="block text-base text-foreground group-hover:text-primary">
          {assignment.title}
        </span>
        <span className="mt-1 block text-sm text-muted">
          {assignment.dueLabel ?? "Sin fecha límite"}
        </span>
      </span>
      <span className="hidden text-sm text-muted sm:inline">Entrega</span>
      <ArrowRightIcon className="h-5 w-5 shrink-0 text-muted group-hover:text-primary" />
    </Link>
  );
}
