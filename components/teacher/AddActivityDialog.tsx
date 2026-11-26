"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { ArrowLeftIcon, PlusIcon } from "@/components/ui/icons";
import { ActivityTypeGrid } from "./ActivityTypeGrid";
import { resourceCreators, type ResourceCreator } from "./resource-creators";

const DIALOG_TITLE = "Añadir una actividad o un recurso";

export function AddActivityDialog({ sectionId }: { sectionId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<ResourceCreator | null>(null);

  function open() {
    setSelected(null);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <div className="flex items-center gap-3 py-3">
        <span aria-hidden className="flex-1 border-t border-dashed border-line" />
        <button
          type="button"
          onClick={open}
          className="inline-flex items-center gap-2 rounded-sm px-3 py-2 text-center text-sm font-medium text-primary transition-colors hover:bg-primary/5"
        >
          <PlusIcon className="h-4 w-4" />
          {DIALOG_TITLE}
        </button>
        <span aria-hidden className="flex-1 border-t border-dashed border-line" />
      </div>
      <Dialog open={isOpen} onClose={close} title={selected ? `Nuevo: ${selected.label}` : DIALOG_TITLE}>
        {selected ? (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Volver
            </button>
            <selected.Form sectionId={sectionId} onCreated={close} />
          </div>
        ) : (
          <ActivityTypeGrid creators={resourceCreators} onSelect={setSelected} />
        )}
      </Dialog>
    </>
  );
}
