import Link from "next/link";
import type { Level } from "@/data/schemas";
import { formatClassCount } from "@/lib/catalog";
import { ArrowRightIcon } from "@/components/ui/icons";
import { StatusDot } from "@/components/ui/StatusDot";

export function LevelModuleList({ level }: { level: Level }) {
  return (
    <div>
      <p className="max-w-2xl text-sm leading-relaxed text-muted">{level.description}</p>
      <ul className="mt-2 divide-y divide-line">
        {level.modules.map((courseModule) => {
          const classCount = courseModule.classes?.length ?? 0;
          return (
            <li key={courseModule.number}>
              <Link
                href={`/campus/${level.slug}/${courseModule.number}`}
                className="group flex items-center gap-4 py-4"
              >
                <span className="flex-1 text-base text-foreground group-hover:text-primary">
                  Módulo {courseModule.number}
                </span>
                <span className="flex items-center gap-2 text-sm text-muted">
                  <StatusDot tone={classCount > 0 ? "available" : "empty"} />
                  {classCount > 0 ? formatClassCount(classCount) : "Todavía no hay nada cargado"}
                </span>
                <ArrowRightIcon className="h-5 w-5 shrink-0 text-muted group-hover:text-primary" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
