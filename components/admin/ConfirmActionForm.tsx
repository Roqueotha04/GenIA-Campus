"use client";

import { useActionState, useState } from "react";
import { ActionButton } from "@/components/ui/Button";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { idleFormState, type FormState } from "@/lib/forms/form-state";
import { DangerSubmitButton } from "./DangerSubmitButton";

interface ConfirmActionFormProps {
  action: (previousState: FormState, formData: FormData) => Promise<FormState>;
  hiddenFields: Record<string, string>;
  label: string;
  confirmLabel: string;
  pendingLabel: string;
}

export function ConfirmActionForm({
  action,
  hiddenFields,
  label,
  confirmLabel,
  pendingLabel,
}: ConfirmActionFormProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [state, formAction] = useActionState(action, idleFormState);

  return (
    <form action={formAction} className="space-y-3">
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <FormStateMessage state={state} />
      {isConfirming ? (
        <div className="flex flex-wrap items-center gap-3">
          <DangerSubmitButton pendingLabel={pendingLabel}>{confirmLabel}</DangerSubmitButton>
          <ActionButton variant="outline" size="sm" onClick={() => setIsConfirming(false)}>
            Cancelar
          </ActionButton>
        </div>
      ) : (
        <ActionButton variant="outline" size="sm" onClick={() => setIsConfirming(true)}>
          {label}
        </ActionButton>
      )}
    </form>
  );
}
