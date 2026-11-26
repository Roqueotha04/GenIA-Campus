import Link from "next/link";
import type { CourseModule } from "@/data/schemas";
import { formatClassCount, formatNumber } from "@/lib/catalog";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { ModuleAvailability } from "@/lib/course-content/course-content-types";
import { StatusDot } from "@/components/ui/StatusDot";

interface ModuleCardProps {
  levelSlug: string;
  courseModule: CourseModule;
  availability?: ModuleAvailability;
}

const availabilityLabels: Record<ModuleAvailability, string> = {
  available: "Disponible",
  enrolled: "Inscripto",
};

function resolveStatusLabel(availability: ModuleAvailability | undefined, classCount: number): string {
  if (availability) return availabilityLabels[availability];
  return classCount > 0 ? formatClassCount(classCount) : "Todavía no hay nada cargado";
}

export function ModuleCard({ levelSlug, courseModule, availability }: ModuleCardProps) {
  const { number, classes } = courseModule;
  const classCount = classes?.length ?? 0;

  return (
    <Link
      href={`/campus/${levelSlug}/${number}`}
      className="group flex flex-col border border-line bg-surface p-6 transition-colors hover:border-navy"
    >
      <p className="text-xs tracking-[0.2em] text-muted">{formatNumber(number)}</p>
      <h2 className="mt-4 font-heading text-xl font-semibold tracking-tight text-foreground">
        Módulo {number}
      </h2>
      <div className="mt-8 flex flex-1 items-end justify-between gap-4">
        <p className="flex items-center gap-2 text-sm text-foreground">
          <StatusDot tone={availability || classCount > 0 ? "available" : "empty"} />
          {resolveStatusLabel(availability, classCount)}
        </p>
        <ArrowRightIcon className="h-5 w-5 shrink-0 text-foreground transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
