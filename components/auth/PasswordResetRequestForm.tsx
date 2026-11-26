"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth/auth-actions";
import { idleFormState } from "@/lib/forms/form-state";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { TextField } from "@/components/ui/TextField";

export function PasswordResetRequestForm() {
  const [state, formAction] = useActionState(requestPasswordReset, idleFormState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <TextField label="Email" name="email" type="email" autoComplete="email" required />
      <FormStateMessage state={state} />
      <SubmitButton pendingLabel="Enviando…" className="w-full">
        Enviar link
      </SubmitButton>
      <p className="text-center text-sm text-muted">
        ¿No te llega el mail? Escribinos al instituto y te ayudamos.
      </p>
      <Link
        href="/acceso"
        className="text-center text-sm text-muted underline-offset-4 transition-colors hover:text-primary hover:underline"
      >
        Volver a ingresar
      </Link>
    </form>
  );
}
