"use client";

import { useState } from "react";
import { ActionButton } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import type { ForumRecord } from "@/lib/forums/forum-types";
import { ForumEditForm } from "./ForumEditForm";

export function EditForumButton({ forum }: { forum: ForumRecord }) {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => setIsOpen(false);

  return (
    <>
      <ActionButton variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        Editar foro
      </ActionButton>
      <Dialog open={isOpen} onClose={closeDialog} title="Editar foro">
        <ForumEditForm forum={forum} onSaved={closeDialog} />
      </Dialog>
    </>
  );
}
