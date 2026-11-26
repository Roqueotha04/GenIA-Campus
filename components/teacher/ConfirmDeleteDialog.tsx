"use client";

import { useActionState } from "react";
import { ActionButton } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { useFormSuccess } from "@/hooks/useFormSuccess";
import { idleFormState, type FormState } from "@/lib/forms/form-state";
import { HiddenFields } from "./HiddenFields";

type FormAction = (previous: FormState, formData: FormData) => Promise<FormState>;

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  warning: string;
  action: FormAction;
  hiddenFields: Record<string, string>;
}

interface ConfirmDeleteFormProps {
  onClose: () => void;
  warning: string;
  action: FormAction;
  hiddenFields: Record<string, string>;
}

function ConfirmDeleteForm({ onClose, warning, action, hiddenFields }: ConfirmDeleteFormProps) {
  const [state, formAction] = useActionState(action, idleFormState);
  useFormSuccess(state, onClose);

  return (
    <form action={formAction} className="space-y-4">
      <HiddenFields fields={hiddenFields} />
      <p className="text-sm text-foreground">{warning}</p>
      <FormStateMessage state={state} />
      <div className="flex flex-wrap gap-2">
        <SubmitButton pendingLabel="Eliminando…" variant="outline" size="sm" className="border-danger text-danger">
          Sí, eliminar
        </SubmitButton>
        <ActionButton variant="outline" size="sm" onClick={onClose}>
          Cancelar
        </ActionButton>
      </div>
    </form>
  );
}

export function ConfirmDeleteDialog({ open, onClose, title, ...formProps }: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <ConfirmDeleteForm onClose={onClose} {...formProps} />
    </Dialog>
  );
}
