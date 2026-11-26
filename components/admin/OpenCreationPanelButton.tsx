"use client";

import { ActionButton } from "@/components/ui/Button";
import { PlusIcon } from "@/components/ui/icons";
import { useCreationPanel } from "./CreationPanelProvider";

export function OpenCreationPanelButton({ label }: { label: string }) {
  const { openPanel } = useCreationPanel();

  return (
    <ActionButton size="sm" onClick={openPanel}>
      <PlusIcon className="h-4 w-4" />
      {label}
    </ActionButton>
  );
}
