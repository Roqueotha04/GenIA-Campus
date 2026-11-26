import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ManagedSection } from "@/lib/teacher/load-course-management";
import { SectionCard } from "./SectionCard";
import { SectionCreateDialog } from "./SectionCreateDialog";

interface SectionsManagerProps {
  courseId: string;
  sections: ManagedSection[];
}

export function SectionsManager({ courseId, sections }: SectionsManagerProps) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading title="Contenido" />
        <SectionCreateDialog courseId={courseId} />
      </div>
      {sections.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          Todavía no hay secciones. Agregá la primera, por ejemplo &quot;Clase 1&quot;.
        </p>
      ) : (
        <ol className="mt-6 space-y-4">
          {sections.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              isFirst={index === 0}
              isLast={index === sections.length - 1}
            />
          ))}
        </ol>
      )}
    </div>
  );
}
