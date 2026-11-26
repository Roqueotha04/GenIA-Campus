import Link from "next/link";
import type { CourseNoticeItem } from "@/lib/course-content/course-content-types";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface CourseNoticesPreviewProps {
  notices: CourseNoticeItem[];
  noticesHref: string;
}

export function CourseNoticesPreview({ notices, noticesHref }: CourseNoticesPreviewProps) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading title="Avisos recientes" />
        <Link
          href={noticesHref}
          className="group flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-navy"
        >
          Ver todos los avisos
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
      {notices.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          Todavía no hay avisos. Cuando tu docente publique uno, aparece acá.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-line border border-line bg-surface">
          {notices.map((notice) => (
            <li key={notice.id} className="p-5 md:px-6">
              <p className="font-heading text-lg font-semibold tracking-tight text-foreground">
                {notice.title}
              </p>
              <p className="mt-1 text-sm text-muted">{notice.createdLabel}</p>
              <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-relaxed text-foreground">
                {notice.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
