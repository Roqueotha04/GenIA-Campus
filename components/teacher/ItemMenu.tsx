"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { MoreIcon } from "@/components/ui/icons";

const CloseItemMenuContext = createContext<() => void>(() => {});

export function useCloseItemMenu(): () => void {
  return useContext(CloseItemMenuContext);
}

interface ItemMenuProps {
  label: string;
  children: ReactNode;
}

export function ItemMenu({ label, children }: ItemMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsidePointer(event: PointerEvent) {
      const container = containerRef.current;
      if (container && event.target instanceof Node && !container.contains(event.target)) setIsOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
        aria-label={`Opciones de ${label}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        className="rounded-sm p-1.5 text-muted transition-colors hover:bg-background hover:text-foreground"
      >
        <MoreIcon className="h-5 w-5" />
      </button>
      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label={`Opciones de ${label}`}
          className="absolute right-0 top-full z-20 mt-1 w-52 rounded-sm border border-line bg-surface py-1"
        >
          <CloseItemMenuContext.Provider value={() => setIsOpen(false)}>{children}</CloseItemMenuContext.Provider>
        </div>
      )}
    </div>
  );
}
