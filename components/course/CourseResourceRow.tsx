import Link from "next/link";
import type { CourseResourceItem } from "@/lib/course-content/course-content-types";
import { ArrowRightIcon, DownloadIcon } from "@/components/ui/icons";
import { CourseResourceIcon } from "./CourseResourceIcon";

const rowClasses = "group flex items-center gap-4 py-4";

function resolveActionLabel(resource: CourseResourceItem): string {
  if (resource.isDownload) return "Descargar";
  return "Abrir";
}

function CourseResourceRowContent({ resource }: { resource: CourseResourceItem }) {
  const ActionIcon = resource.isDownload ? DownloadIcon : ArrowRightIcon;

  return (
    <>
      <CourseResourceIcon kind={resource.kind} className="h-6 w-6 shrink-0 text-primary" />
      <span className="min-w-0 flex-1">
        <span className="block text-base text-foreground group-hover:text-primary">{resource.title}</span>
        {resource.subtitle && <span className="mt-0.5 block text-sm text-muted">{resource.subtitle}</span>}
      </span>
      <span className="hidden text-sm text-muted sm:inline">{resolveActionLabel(resource)}</span>
      <ActionIcon className="h-5 w-5 shrink-0 text-muted group-hover:text-primary" />
    </>
  );
}

export function CourseResourceRow({ resource }: { resource: CourseResourceItem }) {
  if (!resource.href) {
    return (
      <div className={rowClasses}>
        <CourseResourceIcon kind={resource.kind} className="h-6 w-6 shrink-0 text-muted" />
        <span className="flex-1 text-base text-muted">{resource.title}</span>
        <span className="text-sm text-muted">No disponible</span>
      </div>
    );
  }

  if (resource.opensInNewTab) {
    return (
      <a href={resource.href} target="_blank" rel="noopener noreferrer" className={rowClasses}>
        <CourseResourceRowContent resource={resource} />
      </a>
    );
  }

  if (resource.isDownload) {
    return (
      <a href={resource.href} download className={rowClasses}>
        <CourseResourceRowContent resource={resource} />
      </a>
    );
  }

  return (
    <Link href={resource.href} className={rowClasses}>
      <CourseResourceRowContent resource={resource} />
    </Link>
  );
}
