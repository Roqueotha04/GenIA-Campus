"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/auth/auth-actions";
import { idleFormState } from "@/lib/forms/form-state";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { TextField } from "@/components/ui/TextField";

export function LoginForm() {
  const [state, formAction] = useActionState(signIn, idleFormState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <TextField label="Email" name="email" type="email" autoComplete="email" required />
      <TextField
        label="Clave"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <FormStateMessage state={state} />
      <SubmitButton pendingLabel="Ingresando…" className="w-full">
        Ingresar
      </SubmitButton>
      <Link
        href="/acceso/recuperar"
        className="text-center text-sm text-muted underline-offset-4 transition-colors hover:text-primary hover:underline"
      >
        Olvidé mi clave
      </Link>
    </form>
  );
}
