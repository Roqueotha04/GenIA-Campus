import Link from "next/link";
import type { CourseModule } from "@/data/schemas";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { ModuleAvailability } from "@/lib/course-content/course-content-types";
import { ModuleStatus } from "./ModuleStatus";

interface ModuleCardProps {
  levelSlug: string;
  courseModule: CourseModule;
  availability?: ModuleAvailability;
}

export function ModuleCard({ levelSlug, courseModule, availability }: ModuleCardProps) {
  return (
    <Link
      href={`/campus/${levelSlug}/${courseModule.number}`}
      className="group flex flex-col gap-4 border border-line bg-surface p-4 transition-colors hover:border-navy"
    >
      <h2 className="font-heading text-base font-semibold text-foreground group-hover:text-primary">
        Módulo {courseModule.number}
      </h2>
      <div className="flex flex-1 items-end justify-between gap-3">
        <ModuleStatus courseModule={courseModule} availability={availability} />
        <ArrowRightIcon className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" />
      </div>
    </Link>
  );
}
