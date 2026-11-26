"use client";

import { useActionState, type ReactNode } from "react";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { useFormSuccess } from "@/hooks/useFormSuccess";
import { idleFormState, type FormState } from "@/lib/forms/form-state";

interface AdminFormProps {
  action: (previousState: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  pendingLabel: string;
  variant?: "primary" | "outline";
  onSuccess?: (message: string) => void;
  children?: ReactNode;
}

export function AdminForm({
  action,
  submitLabel,
  pendingLabel,
  variant,
  onSuccess,
  children,
}: AdminFormProps) {
  const [state, formAction] = useActionState(action, idleFormState);
  const notifySuccess = onSuccess ? () => onSuccess(state.message) : undefined;
  useFormSuccess(state, notifySuccess);

  return (
    <form action={formAction} className="space-y-4">
      {children}
      <FormStateMessage state={state} />
      <SubmitButton pendingLabel={pendingLabel} variant={variant} size="sm">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
