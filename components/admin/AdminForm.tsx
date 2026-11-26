"use client";

import { useActionState, type ReactNode } from "react";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { idleFormState, type FormState } from "@/lib/forms/form-state";

interface AdminFormProps {
  action: (previousState: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  pendingLabel: string;
  variant?: "primary" | "outline";
  children?: ReactNode;
}

export function AdminForm({ action, submitLabel, pendingLabel, variant, children }: AdminFormProps) {
  const [state, formAction] = useActionState(action, idleFormState);

  return (
    <form action={formAction} className="space-y-5">
      {children}
      <FormStateMessage state={state} />
      <SubmitButton pendingLabel={pendingLabel} variant={variant}>
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
