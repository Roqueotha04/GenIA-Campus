"use client";

import { useState } from "react";
import { AssignmentForm } from "@/components/assignments/AssignmentForm";
import { Dialog } from "@/components/ui/Dialog";
import type { ManagedResource } from "@/lib/teacher/load-course-management";
import { deleteResourceAction, moveResourceAction } from "@/lib/teacher/resource-actions";
import type { ResourceKind } from "@/types/database";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { ItemMenu } from "./ItemMenu";
import { MenuAction, MenuLink } from "./ItemMenuEntries";
import { MenuMoveEntries } from "./MenuMoveEntries";
import { RenameResourceForm } from "./RenameResourceForm";

type ResourceDialog = "rename" | "editAssignment" | "delete" | null;

const deleteWarnings: Record<ResourceKind, string> = {
  file: "También se borra el archivo guardado. No se puede deshacer.",
  link: "El enlace se quita de esta sección. No se puede deshacer.",
  game: "El juego se quita de esta sección. Sigue disponible para agregarlo de nuevo.",
  quiz: "El cuestionario se quita de esta sección, pero sigue guardado en Cuestionarios.",
  assignment: "Se borran también las entregas de los alumnos y sus archivos. No se puede deshacer.",
  forum: "Se borran también todos los temas y respuestas del foro. No se puede deshacer.",
};

interface ResourceItemMenuProps {
  resource: ManagedResource;
  isFirst: boolean;
  isLast: boolean;
}

export function ResourceItemMenu({ resource, isFirst, isLast }: ResourceItemMenuProps) {
  const [openDialog, setOpenDialog] = useState<ResourceDialog>(null);
  const closeDialog = () => setOpenDialog(null);
  const { assignment } = resource;

  return (
    <>
      <ItemMenu label={resource.title}>
        {assignment ? (
          <>
            <MenuAction onSelect={() => setOpenDialog("editAssignment")}>Editar</MenuAction>
            <MenuLink href={assignment.href}>Ver entregas</MenuLink>
          </>
        ) : (
          <MenuAction onSelect={() => setOpenDialog("rename")}>Renombrar</MenuAction>
        )}
        <MenuMoveEntries
          action={moveResourceAction}
          hiddenFields={{ resourceId: resource.id }}
          isFirst={isFirst}
          isLast={isLast}
        />
        <MenuAction tone="danger" onSelect={() => setOpenDialog("delete")}>
          Eliminar
        </MenuAction>
      </ItemMenu>
      <Dialog open={openDialog === "rename"} onClose={closeDialog} title="Renombrar">
        <RenameResourceForm resourceId={resource.id} title={resource.title} onSaved={closeDialog} />
      </Dialog>
      {assignment && (
        <Dialog open={openDialog === "editAssignment"} onClose={closeDialog} title="Editar tarea">
          <AssignmentForm sectionId={assignment.section_id} assignment={assignment} onSaved={closeDialog} />
        </Dialog>
      )}
      <ConfirmDeleteDialog
        open={openDialog === "delete"}
        onClose={closeDialog}
        title={`Eliminar "${resource.title}"`}
        warning={deleteWarnings[resource.kind]}
        action={deleteResourceAction}
        hiddenFields={{ resourceId: resource.id }}
      />
    </>
  );
}
