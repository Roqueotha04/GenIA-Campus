import Link from "next/link";
import type { CourseModule } from "@/data/schemas";
import { GoToCourseHint } from "./GoToCourseHint";

interface ModuleCardProps {
  levelSlug: string;
  courseModule: CourseModule;
}

export function ModuleCard({ levelSlug, courseModule }: ModuleCardProps) {
  return (
    <Link
      href={`/campus/${levelSlug}/${courseModule.number}`}
      className="group flex flex-col gap-4 border border-line bg-surface p-4 transition-colors hover:border-navy"
    >
      <h2 className="font-heading text-base font-semibold text-foreground group-hover:text-primary">
        Módulo {courseModule.number}
      </h2>
      <div className="flex flex-1 items-end justify-end">
        <GoToCourseHint />
      </div>
    </Link>
  );
}
