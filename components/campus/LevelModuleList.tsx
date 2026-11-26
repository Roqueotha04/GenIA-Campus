import Link from "next/link";
import type { Level } from "@/data/schemas";
import { GoToCourseHint } from "./GoToCourseHint";

export function LevelModuleList({ level }: { level: Level }) {
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
              <GoToCourseHint />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
