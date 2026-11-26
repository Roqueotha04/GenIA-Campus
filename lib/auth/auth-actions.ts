"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { errorState, successState, type FormState } from "@/lib/forms/form-state";
import { CAMPUS_PATH, LOGIN_PATH, MIN_PASSWORD_LENGTH } from "./roles";
import { getSiteUrl } from "./site-url";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const emailSchema = z.object({ email: z.email() });

const newPasswordSchema = z
  .object({
    password: z.string().min(MIN_PASSWORD_LENGTH),
    confirmation: z.string(),
  })
  .refine((values) => values.password === values.confirmation);

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function signIn(_previousState: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState("Completá un email válido y tu clave.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: normalizeEmail(parsed.data.email),
    password: parsed.data.password,
  });

  if (error) return errorState("El email o la clave no coinciden. Revisalos e intentá de nuevo.");
  redirect(CAMPUS_PATH);
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(LOGIN_PATH);
}

export async function requestPasswordReset(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = emailSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState("Ingresá un email válido.");

  const supabase = await createSupabaseServerClient();
  const siteUrl = await getSiteUrl();
  await supabase.auth.resetPasswordForEmail(normalizeEmail(parsed.data.email), {
    redirectTo: `${siteUrl}/auth/confirm?next=/acceso/nueva-clave`,
  });

  return successState(
    "Si el email está registrado, te llega un link para elegir una clave nueva. Revisá también el correo no deseado.",
  );
}

export async function updatePassword(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = newPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return errorState(
      `La clave tiene que tener al menos ${MIN_PASSWORD_LENGTH} caracteres y coincidir en los dos campos.`,
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return errorState("El link venció o ya se usó. Pedí uno nuevo desde “Olvidé mi clave”.");
  }

  redirect(CAMPUS_PATH);
}
