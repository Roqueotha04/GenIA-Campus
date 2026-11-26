import type { ManagedSection } from "@/lib/teacher/load-course-management";
import { AddActivityDialog } from "./AddActivityDialog";
import { ResourceItem } from "./ResourceItem";
import { SectionMenu } from "./SectionMenu";

interface SectionCardProps {
  section: ManagedSection;
  isFirst: boolean;
  isLast: boolean;
}

export function SectionCard({ section, isFirst, isLast }: SectionCardProps) {
  return (
    <li className="rounded-sm border border-line bg-surface">
      <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3 md:px-5">
        <div className="min-w-0">
          <h3 className="break-words text-base font-semibold text-foreground md:text-lg">{section.title}</h3>
          {section.description && <p className="mt-1 text-sm text-muted">{section.description}</p>}
        </div>
        <SectionMenu
          section={{ id: section.id, title: section.title, description: section.description }}
          isFirst={isFirst}
          isLast={isLast}
        />
      </div>

      <div className="px-4 md:px-5">
        {section.resources.length === 0 ? (
          <p className="py-4 text-sm text-muted">
            Esta sección todavía está vacía. Añadí un archivo, un foro, una tarea o un cuestionario.
          </p>
        ) : (
          <ul className="divide-y divide-dashed divide-line">
            {section.resources.map((resource, index) => (
              <ResourceItem
                key={resource.id}
                resource={resource}
                isFirst={index === 0}
                isLast={index === section.resources.length - 1}
              />
            ))}
          </ul>
        )}
        <AddActivityDialog sectionId={section.id} />
      </div>
    </li>
  );
}
