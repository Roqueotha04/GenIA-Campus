import Link from "next/link";
import type { CourseClass } from "@/data/schemas";
import { formatNumber } from "@/lib/catalog";
import { ArrowRightIcon } from "@/components/ui/icons";

interface ClassCardProps {
  href: string;
  courseClass: CourseClass;
}

function listClassResources(courseClass: CourseClass): string[] {
  const resources: string[] = [];
  if (courseClass.game) resources.push("Juego");
  if (courseClass.presentationPdf) resources.push("Presentación");
  if (courseClass.summaryDocument) resources.push("Resumen");
  if (courseClass.activity) resources.push("Actividad");
  return resources;
}

export function ClassCard({ href, courseClass }: ClassCardProps) {
  const resources = listClassResources(courseClass);

  return (
    <Link
      href={href}
      className="group grid gap-4 border border-line bg-surface p-6 transition-colors hover:border-navy md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8"
    >
      <p className="font-heading text-3xl font-semibold tracking-tight text-primary md:w-16">
        {formatNumber(courseClass.number)}
      </p>
      <div>
        <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          {courseClass.title}
        </h3>
        <p className="mt-2 text-sm text-muted">{resources.join(" · ")}</p>
      </div>
      <ArrowRightIcon className="hidden h-5 w-5 text-foreground transition-transform group-hover:translate-x-1 md:block" />
    </Link>
  );
}
