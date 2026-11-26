"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCloseItemMenu } from "./ItemMenu";

type MenuEntryTone = "default" | "danger";

const toneClasses: Record<MenuEntryTone, string> = {
  default: "text-foreground",
  danger: "text-danger",
};

export const menuEntryClasses =
  "block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40";

interface MenuActionProps {
  onSelect: () => void;
  tone?: MenuEntryTone;
  children: ReactNode;
}

export function MenuAction({ onSelect, tone = "default", children }: MenuActionProps) {
  const closeMenu = useCloseItemMenu();

  function handleClick() {
    closeMenu();
    onSelect();
  }

  return (
    <button type="button" role="menuitem" onClick={handleClick} className={`${menuEntryClasses} ${toneClasses[tone]}`}>
      {children}
    </button>
  );
}

export function MenuLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} role="menuitem" className={`${menuEntryClasses} ${toneClasses.default}`}>
      {children}
    </Link>
  );
}
