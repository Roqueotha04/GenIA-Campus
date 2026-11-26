"use client";

import { useActionState } from "react";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { idleFormState, type FormState } from "@/lib/forms/form-state";
import { HiddenFields } from "./HiddenFields";

type FormAction = (previous: FormState, formData: FormData) => Promise<FormState>;

interface MoveControlsProps {
  action: FormAction;
  hiddenFields: Record<string, string>;
  isFirst: boolean;
  isLast: boolean;
  itemLabel: string;
}

const moveButtonClasses =
  "h-10 rounded-sm border border-navy/25 px-3 text-sm font-semibold text-foreground transition-colors hover:border-navy hover:bg-navy/5 disabled:cursor-not-allowed disabled:opacity-40";

export function MoveControls({ action, hiddenFields, isFirst, isLast, itemLabel }: MoveControlsProps) {
  const [state, formAction, isPending] = useActionState(action, idleFormState);

  return (
    <form action={formAction} className="space-y-2">
      <HiddenFields fields={hiddenFields} />
      <div className="flex gap-2">
        <button
          type="submit"
          name="direction"
          value="up"
          disabled={isFirst || isPending}
          aria-label={`Subir ${itemLabel}`}
          className={moveButtonClasses}
        >
          Subir
        </button>
        <button
          type="submit"
          name="direction"
          value="down"
          disabled={isLast || isPending}
          aria-label={`Bajar ${itemLabel}`}
          className={moveButtonClasses}
        >
          Bajar
        </button>
      </div>
      {state.status === "error" && <FormStateMessage state={state} />}
    </form>
  );
}
