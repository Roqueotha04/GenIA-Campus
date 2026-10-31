import { levels } from "@/data/levels";
import { formatModuleCount } from "@/lib/catalog";

export function LevelIndex() {
  return (
    <aside aria-label="Niveles del campus">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-white/50">
        Niveles
      </p>
      <ul className="mt-4 border-t border-white/15">
        {levels.map((level) => (
          <li
            key={level.slug}
            className="flex items-baseline justify-between gap-4 border-b border-white/15 py-4"
          >
            <span className="flex items-center gap-3 font-heading text-xl font-medium">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-cyan" />
              {level.name}
            </span>
            <span className="text-sm text-white/55">{formatModuleCount(level.modules.length)}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
