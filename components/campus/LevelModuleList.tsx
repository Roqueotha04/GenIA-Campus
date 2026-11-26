import Link from "next/link";
import type { Level } from "@/data/schemas";
import type { ModuleAvailability } from "@/lib/course-content/course-content-types";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ModuleStatus } from "./ModuleStatus";

interface LevelModuleListProps {
  level: Level;
  availability?: Record<number, ModuleAvailability>;
}

export function LevelModuleList({ level, availability = {} }: LevelModuleListProps) {
  return (
    <div>
      <p className="max-w-2xl text-sm leading-relaxed text-muted">{level.description}</p>
      <ul className="mt-2 divide-y divide-line">
        {level.modules.map((courseModule) => (
          <li key={courseModule.number}>
            <Link
              href={`/campus/${level.slug}/${courseModule.number}`}
              className="group flex items-center gap-3 py-2.5"
            >
              <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary">
                Módulo {courseModule.number}
              </span>
              <ModuleStatus courseModule={courseModule} availability={availability[courseModule.number]} />
              <ArrowRightIcon className="h-4 w-4 shrink-0 text-muted group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
