import type { Level } from "@/data/schemas";

function listTopics(level: Level) {
  return level.modules.flatMap((courseModule) =>
    (courseModule.classes ?? []).map((courseClass) => ({
      key: `${courseModule.number}-${courseClass.number}`,
      moduleNumber: courseModule.number,
      title: courseClass.title,
    })),
  );
}

export function LevelTopics({ level }: { level: Level }) {
  const topics = listTopics(level);

  if (topics.length === 0) {
    return (
      <p className="text-sm text-muted">Los temas se publican a medida que se cargan las clases.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-2 text-sm text-foreground">
      {topics.map((topic) => (
        <li key={topic.key}>
          <span className="text-xs text-muted">Módulo {topic.moduleNumber} · </span>
          {topic.title}
        </li>
      ))}
    </ul>
  );
}
