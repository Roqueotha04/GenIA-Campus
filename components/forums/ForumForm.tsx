"use client";

import { startTransition, useActionState, useRef, type FormEvent, type ReactNode } from "react";
import { HiddenFields } from "@/components/teacher/HiddenFields";
import { ActionButton } from "@/components/ui/Button";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { idleFormState, type FormState } from "@/lib/forms/form-state";
import { useFormSuccess } from "@/hooks/useFormSuccess";

type FormAction = (previous: FormState, formData: FormData) => Promise<FormState>;

interface ForumFormProps {
  action: FormAction;
  hiddenFields: Record<string, string>;
  submitLabel: string;
  pendingLabel: string;
  onSuccess?: () => void;
  children: ReactNode;
}

export function ForumForm({ action, hiddenFields, submitLabel, pendingLabel, onSuccess, children }: ForumFormProps) {
  const [state, formAction, isPending] = useActionState(action, idleFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useFormSuccess(state, () => {
    formRef.current?.reset();
    onSuccess?.();
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <HiddenFields fields={hiddenFields} />
      {children}
      <FormStateMessage state={state} />
      <ActionButton type="submit" size="sm" disabled={isPending}>
        {isPending ? pendingLabel : submitLabel}
      </ActionButton>
    </form>
  );
}
