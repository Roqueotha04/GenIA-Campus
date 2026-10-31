import Link from "next/link";
import type { Level } from "@/data/schemas";
import { countModulesWithClasses, formatModuleCount } from "@/lib/catalog";
import { levelAccentBackground } from "@/lib/level-accent";
import { ArrowRightIcon } from "@/components/ui/icons";
import { StatusDot } from "@/components/ui/StatusDot";

export function LevelCard({ level }: { level: Level }) {
  const modulesWithContent = countModulesWithClasses(level);
  const hasContent = modulesWithContent > 0;

  return (
    <Link
      href={`/campus/${level.slug}`}
      className="group flex flex-col border border-line bg-surface transition-colors hover:border-navy"
    >
      <span aria-hidden className={`block h-1 w-full ${levelAccentBackground[level.accent]}`} />
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-muted">
          {formatModuleCount(level.modules.length)}
        </p>
        <h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground">
          {level.name}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{level.description}</p>
        <div className="mt-8 flex flex-1 items-end justify-between gap-4">
          <p className="flex items-center gap-2 text-sm text-foreground">
            <StatusDot tone={hasContent ? "available" : "empty"} />
            {hasContent ? "Contenido disponible" : "Todavía no hay nada cargado"}
          </p>
          <ArrowRightIcon className="h-5 w-5 shrink-0 text-foreground transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
