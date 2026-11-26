"use client";

import type { ReactNode } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { useCreationPanel } from "./CreationPanelProvider";

export function CreationPanel({ title, children }: { title: string; children: ReactNode }) {
  const { isOpen, closePanel } = useCreationPanel();

  return (
    <Dialog open={isOpen} onClose={closePanel} title={title} placement="side">
      {children}
    </Dialog>
  );
}
