"use client";

import { useState } from "react";
import { ActionButton } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { PlusIcon } from "@/components/ui/icons";
import { SectionCreateForm } from "./SectionCreateForm";

export function SectionCreateDialog({ courseId }: { courseId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <>
      <ActionButton variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <PlusIcon className="h-4 w-4" />
        Agregar sección
      </ActionButton>
      <Dialog open={isOpen} onClose={close} title="Nueva sección">
        <SectionCreateForm courseId={courseId} onCreated={close} />
      </Dialog>
    </>
  );
}
