"use client";

import { useState } from "react";
import { ActionButton } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { PlusIcon } from "@/components/ui/icons";
import { TopicCreateForm } from "./TopicCreateForm";

export function NewTopicButton({ forumId }: { forumId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ActionButton size="sm" onClick={() => setIsOpen(true)}>
        <PlusIcon className="h-4 w-4" />
        Nuevo tema
      </ActionButton>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} title="Nuevo tema">
        <TopicCreateForm forumId={forumId} />
      </Dialog>
    </>
  );
}
