"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "./icons";

type DialogPlacement = "center" | "side";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  placement?: DialogPlacement;
  children: ReactNode;
}

const placementClasses: Record<DialogPlacement, string> = {
  center:
    "m-auto w-[calc(100%-2rem)] max-w-3xl max-h-[calc(100dvh-2rem)] rounded-sm",
  side: "ml-auto mr-0 my-0 h-dvh max-h-dvh w-full max-w-md",
};

export function Dialog({ open, onClose, title, placement = "center", children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      aria-label={title}
      className={`${placementClasses[placement]} border border-line bg-surface p-0 text-foreground backdrop:bg-navy/50`}
    >
      <div className="flex max-h-[inherit] flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-sm p-1 text-muted transition-colors hover:bg-background hover:text-foreground"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5">{open && children}</div>
      </div>
    </dialog>
  );
}
