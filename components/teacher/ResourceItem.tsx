import { TextField } from "@/components/ui/TextField";
import { findRegisteredGame } from "@/data/games";
import { formatFileSize } from "@/lib/teacher/format-file-size";
import type { ManagedResource } from "@/lib/teacher/load-course-management";
import { deleteResourceAction, moveResourceAction, renameResourceAction } from "@/lib/teacher/resource-actions";
import { ActionForm } from "./ActionForm";
import { ConfirmActionForm } from "./ConfirmActionForm";
import { MoveControls } from "./MoveControls";

const kindLabels: Record<ManagedResource["kind"], string> = {
  file: "Archivo",
  link: "Enlace",
  game: "Juego",
  quiz: "Cuestionario",
};

function describeResource(resource: ManagedResource): string {
  if (resource.kind === "link") return resource.url ?? "";
  if (resource.kind === "game") return findRegisteredGame(resource.game_slug ?? "")?.title ?? "Juego no disponible";
  if (resource.kind === "quiz") return "Los alumnos lo rinden desde el módulo.";
  if (resource.kind === "file" && resource.size_bytes) return formatFileSize(resource.size_bytes);
  return "";
}

interface ResourceItemProps {
  resource: ManagedResource;
  isFirst: boolean;
  isLast: boolean;
}

export function ResourceItem({ resource, isFirst, isLast }: ResourceItemProps) {
  const detail = describeResource(resource);

  return (
    <li className="border border-line bg-surface p-4">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted">{kindLabels[resource.kind]}</p>
      <p className="mt-1 break-words font-medium text-foreground">{resource.title}</p>
      {detail && <p className="mt-1 break-all text-sm text-muted">{detail}</p>}

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <MoveControls
          action={moveResourceAction}
          hiddenFields={{ resourceId: resource.id }}
          isFirst={isFirst}
          isLast={isLast}
          itemLabel={resource.title}
        />
        <ConfirmActionForm
          action={deleteResourceAction}
          hiddenFields={{ resourceId: resource.id }}
          label="Eliminar"
          confirmLabel="Sí, eliminar"
          pendingLabel="Eliminando…"
          warning={resource.kind === "file" ? "También se borra el archivo guardado." : undefined}
        />
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-primary">Editar título</summary>
        <div className="mt-3">
          <ActionForm
            action={renameResourceAction}
            hiddenFields={{ resourceId: resource.id }}
            submitLabel="Guardar título"
            pendingLabel="Guardando…"
            variant="outline"
          >
            <TextField label="Título" name="title" defaultValue={resource.title} required />
          </ActionForm>
        </div>
      </details>
    </li>
  );
}
