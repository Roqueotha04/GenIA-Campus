"use client";

import { useActionState } from "react";
import { idleFormState, type FormState } from "@/lib/forms/form-state";
import { HiddenFields } from "./HiddenFields";
import { menuEntryClasses } from "./ItemMenuEntries";

type FormAction = (previous: FormState, formData: FormData) => Promise<FormState>;

interface MenuMoveEntriesProps {
  action: FormAction;
  hiddenFields: Record<string, string>;
  isFirst: boolean;
  isLast: boolean;
}

export function MenuMoveEntries({ action, hiddenFields, isFirst, isLast }: MenuMoveEntriesProps) {
  const [state, formAction, isPending] = useActionState(action, idleFormState);

  return (
    <form action={formAction}>
      <HiddenFields fields={hiddenFields} />
      <button
        type="submit"
        role="menuitem"
        name="direction"
        value="up"
        disabled={isFirst || isPending}
        className={`${menuEntryClasses} text-foreground`}
      >
        Subir
      </button>
      <button
        type="submit"
        role="menuitem"
        name="direction"
        value="down"
        disabled={isLast || isPending}
        className={`${menuEntryClasses} text-foreground`}
      >
        Bajar
      </button>
      {state.status === "error" && (
        <p role="alert" className="px-3 py-2 text-xs text-danger">
          {state.message}
        </p>
      )}
    </form>
  );
}
