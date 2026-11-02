import type { ModuleResource } from "@/lib/module-resources";
import { ResourceRow } from "./ResourceRow";

interface ResourceListProps {
  resources: ModuleResource[];
  emptyMessage: string;
}

export function ResourceList({ resources, emptyMessage }: ResourceListProps) {
  if (resources.length === 0) {
    return <p className="py-2 text-sm text-muted">{emptyMessage}</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {resources.map((resource) => (
        <li key={resource.href}>
          <ResourceRow resource={resource} />
        </li>
      ))}
    </ul>
  );
}
