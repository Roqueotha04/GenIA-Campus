"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

interface DangerSubmitButtonProps {
  children: ReactNode;
  pendingLabel: string;
}

export function DangerSubmitButton({ children, pendingLabel }: DangerSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center justify-center rounded-sm bg-danger px-4 text-sm font-semibold tracking-wide text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
