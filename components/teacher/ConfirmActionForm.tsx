"use client";

import { useActionState, useState } from "react";
import { ActionButton } from "@/components/ui/Button";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { idleFormState, type FormState } from "@/lib/forms/form-state";
import { HiddenFields } from "./HiddenFields";

type FormAction = (previous: FormState, formData: FormData) => Promise<FormState>;

interface ConfirmActionFormProps {
  action: FormAction;
  hiddenFields: Record<string, string>;
  label: string;
  confirmLabel: string;
  pendingLabel: string;
  warning?: string;
}

export function ConfirmActionForm({
  action,
  hiddenFields,
  label,
  confirmLabel,
  pendingLabel,
  warning,
}: ConfirmActionFormProps) {
  const [state, formAction] = useActionState(action, idleFormState);
  const [isArmed, setIsArmed] = useState(false);

  return (
    <form action={formAction} className="space-y-3">
      <HiddenFields fields={hiddenFields} />
      {isArmed && warning && <p className="text-sm text-danger">{warning}</p>}
      <div className="flex flex-wrap items-center gap-2">
        {isArmed ? (
          <>
            <SubmitButton pendingLabel={pendingLabel} variant="outline" size="sm" className="border-danger text-danger">
              {confirmLabel}
            </SubmitButton>
            <ActionButton variant="outline" size="sm" onClick={() => setIsArmed(false)}>
              Cancelar
            </ActionButton>
          </>
        ) : (
          <ActionButton variant="outline" size="sm" onClick={() => setIsArmed(true)}>
            {label}
          </ActionButton>
        )}
      </div>
      <FormStateMessage state={state} />
    </form>
  );
}
