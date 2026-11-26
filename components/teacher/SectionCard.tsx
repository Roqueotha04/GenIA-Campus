import { SectionAssignments } from "@/components/assignments/SectionAssignments";
import type { ManagedSection } from "@/lib/teacher/load-course-management";
import { deleteSectionAction, moveSectionAction } from "@/lib/teacher/section-actions";
import { AddResourcePanel } from "./AddResourcePanel";
import { ConfirmActionForm } from "./ConfirmActionForm";
import { MoveControls } from "./MoveControls";
import { ResourceItem } from "./ResourceItem";
import { SectionEditForm } from "./SectionEditForm";

interface SectionCardProps {
  section: ManagedSection;
  isFirst: boolean;
  isLast: boolean;
}

export function SectionCard({ section, isFirst, isLast }: SectionCardProps) {
  return (
    <li className="border border-line bg-surface p-5 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            {section.title}
          </h3>
          {section.description && <p className="mt-2 text-sm text-muted">{section.description}</p>}
        </div>
        <MoveControls
          action={moveSectionAction}
          hiddenFields={{ sectionId: section.id }}
          isFirst={isFirst}
          isLast={isLast}
          itemLabel={section.title}
        />
      </div>

      <div className="mt-6">
        {section.resources.length === 0 ? (
          <p className="text-sm text-muted">
            Esta sección todavía no tiene recursos. Agregá un archivo, un enlace o un juego.
          </p>
        ) : (
          <ul className="space-y-3">
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
      </div>

      <div className="mt-6">
        <AddResourcePanel sectionId={section.id} />
      </div>

      <div className="mt-6">
        <SectionAssignments sectionId={section.id} assignments={section.assignments} />
      </div>

      <details className="mt-6 border-t border-line pt-5">
        <summary className="cursor-pointer text-sm font-medium text-primary">Editar o eliminar sección</summary>
        <div className="mt-4 space-y-6">
          <SectionEditForm sectionId={section.id} title={section.title} description={section.description} />
          <ConfirmActionForm
            action={deleteSectionAction}
            hiddenFields={{ sectionId: section.id }}
            label="Eliminar sección"
            confirmLabel="Sí, eliminar sección"
            pendingLabel="Eliminando…"
            warning="Se borran también todos sus recursos y archivos. No se puede deshacer."
          />
        </div>
      </details>
    </li>
  );
}
