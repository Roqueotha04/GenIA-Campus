import { levelsWithFeaturedFirst } from "@/lib/catalog";
import { levelAccentBackground } from "@/lib/level-accent";

export function LevelIndex() {
  return (
    <aside aria-label="Niveles del campus" className="rounded-sm border border-white/15 bg-white/5">
      <p className="border-b border-white/15 px-4 py-3 text-sm font-medium text-white/70">Niveles</p>
      <ul className="divide-y divide-white/10">
        {levelsWithFeaturedFirst.map((level) => (
          <li key={level.slug} className="flex items-center gap-3 px-4 py-3 text-base font-medium">
            <span
              aria-hidden
              className={`h-2 w-2 rounded-full ${levelAccentBackground[level.accent]}`}
            />
            {level.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
