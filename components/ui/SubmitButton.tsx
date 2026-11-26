"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ActionButton } from "./Button";

interface SubmitButtonProps {
  children: ReactNode;
  pendingLabel: string;
  variant?: "primary" | "outline" | "outlineOnDark";
  size?: "md" | "sm";
  className?: string;
}

export function SubmitButton({ children, pendingLabel, ...styleProps }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <ActionButton type="submit" disabled={pending} {...styleProps}>
      {pending ? pendingLabel : children}
    </ActionButton>
  );
}
