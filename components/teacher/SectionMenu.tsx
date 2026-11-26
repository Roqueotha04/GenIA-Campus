"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import type { ManagedSection } from "@/lib/teacher/load-course-management";
import { deleteSectionAction, moveSectionAction } from "@/lib/teacher/section-actions";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { ItemMenu } from "./ItemMenu";
import { MenuAction } from "./ItemMenuEntries";
import { MenuMoveEntries } from "./MenuMoveEntries";
import { SectionEditForm } from "./SectionEditForm";

type SectionDialog = "edit" | "delete" | null;

interface SectionMenuProps {
  section: Pick<ManagedSection, "id" | "title" | "description">;
  isFirst: boolean;
  isLast: boolean;
}

export function SectionMenu({ section, isFirst, isLast }: SectionMenuProps) {
  const [openDialog, setOpenDialog] = useState<SectionDialog>(null);
  const closeDialog = () => setOpenDialog(null);

  return (
    <>
      <ItemMenu label={section.title}>
        <MenuAction onSelect={() => setOpenDialog("edit")}>Editar sección</MenuAction>
        <MenuMoveEntries
          action={moveSectionAction}
          hiddenFields={{ sectionId: section.id }}
          isFirst={isFirst}
          isLast={isLast}
        />
        <MenuAction tone="danger" onSelect={() => setOpenDialog("delete")}>
          Eliminar
        </MenuAction>
      </ItemMenu>
      <Dialog open={openDialog === "edit"} onClose={closeDialog} title="Editar sección">
        <SectionEditForm
          sectionId={section.id}
          title={section.title}
          description={section.description}
          onSaved={closeDialog}
        />
      </Dialog>
      <ConfirmDeleteDialog
        open={openDialog === "delete"}
        onClose={closeDialog}
        title={`Eliminar "${section.title}"`}
        warning="Se borran también todo su contenido, las entregas de las tareas y los archivos guardados. No se puede deshacer."
        action={deleteSectionAction}
        hiddenFields={{ sectionId: section.id }}
      />
    </>
  );
}
