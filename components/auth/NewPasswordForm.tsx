"use client";

import { useActionState } from "react";
import { updatePassword } from "@/lib/auth/auth-actions";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/roles";
import { idleFormState } from "@/lib/forms/form-state";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { TextField } from "@/components/ui/TextField";

export function NewPasswordForm() {
  const [state, formAction] = useActionState(updatePassword, idleFormState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <TextField
        label="Clave nueva"
        name="password"
        type="password"
        autoComplete="new-password"
        hint={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres.`}
        required
      />
      <TextField
        label="Repetí la clave"
        name="confirmation"
        type="password"
        autoComplete="new-password"
        required
      />
      <FormStateMessage state={state} />
      <SubmitButton pendingLabel="Guardando…" className="w-full">
        Guardar clave
      </SubmitButton>
    </form>
  );
}
