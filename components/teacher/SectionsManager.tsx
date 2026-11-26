import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ManagedSection } from "@/lib/teacher/load-course-management";
import { SectionCard } from "./SectionCard";
import { SectionCreateForm } from "./SectionCreateForm";

interface SectionsManagerProps {
  courseId: string;
  sections: ManagedSection[];
}

export function SectionsManager({ courseId, sections }: SectionsManagerProps) {
  return (
    <div>
      <SectionHeading title="Secciones" eyebrow="Contenido" />
      {sections.length === 0 ? (
        <p className="mt-8 text-muted">Todavía no hay secciones. Creá la primera, por ejemplo &quot;Clase 1&quot;.</p>
      ) : (
        <ol className="mt-8 space-y-6">
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
      <div className="mt-8 border border-line bg-surface p-5 md:p-8">
        <p className="mb-4 font-medium text-foreground">Nueva sección</p>
        <SectionCreateForm courseId={courseId} />
      </div>
    </div>
  );
}
