"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface CreationPanelState {
  isOpen: boolean;
  successMessage: string | null;
  openPanel: () => void;
  closePanel: () => void;
  completeCreation: (message: string) => void;
}

const CreationPanelContext = createContext<CreationPanelState | null>(null);

interface CreationPanelProviderProps {
  initiallyOpen: boolean;
  children: ReactNode;
}

export function CreationPanelProvider({ initiallyOpen, children }: CreationPanelProviderProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const panelState = useMemo<CreationPanelState>(
    () => ({
      isOpen,
      successMessage,
      openPanel: () => {
        setSuccessMessage(null);
        setIsOpen(true);
      },
      closePanel: () => setIsOpen(false),
      completeCreation: (message) => {
        setSuccessMessage(message);
        setIsOpen(false);
      },
    }),
    [isOpen, successMessage],
  );

  return <CreationPanelContext value={panelState}>{children}</CreationPanelContext>;
}

export function useCreationPanel(): CreationPanelState {
  const panelState = useContext(CreationPanelContext);
  if (!panelState) throw new Error("useCreationPanel se usa dentro de CreationPanelProvider.");
  return panelState;
}
