"use client";

import { useActionState, type ReactNode } from "react";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { idleFormState, type FormState } from "@/lib/forms/form-state";
import { HiddenFields } from "./HiddenFields";

type FormAction = (previous: FormState, formData: FormData) => Promise<FormState>;

interface ActionFormProps {
  action: FormAction;
  hiddenFields: Record<string, string>;
  submitLabel: string;
  pendingLabel: string;
  variant?: "primary" | "outline";
  children: ReactNode;
}

export function ActionForm({
  action,
  hiddenFields,
  submitLabel,
  pendingLabel,
  variant = "primary",
  children,
}: ActionFormProps) {
  const [state, formAction] = useActionState(action, idleFormState);

  return (
    <form action={formAction} className="space-y-4">
      <HiddenFields fields={hiddenFields} />
      {children}
      <FormStateMessage state={state} />
      <SubmitButton pendingLabel={pendingLabel} variant={variant} size="sm">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
