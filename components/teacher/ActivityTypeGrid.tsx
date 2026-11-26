import type { ResourceCreator } from "./resource-creators";

interface ActivityTypeGridProps {
  creators: ResourceCreator[];
  onSelect: (creator: ResourceCreator) => void;
}

export function ActivityTypeGrid({ creators, onSelect }: ActivityTypeGridProps) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {creators.map((creator) => (
        <li key={creator.id}>
          <button
            type="button"
            onClick={() => onSelect(creator)}
            className="flex h-full w-full items-start gap-3 rounded-sm border border-line bg-surface p-4 text-left transition-colors hover:border-primary hover:bg-background"
          >
            <creator.Icon className="h-6 w-6 shrink-0 text-primary" />
            <span>
              <span className="block text-base font-semibold text-foreground">{creator.label}</span>
              <span className="mt-1 block text-sm text-muted">{creator.description}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
