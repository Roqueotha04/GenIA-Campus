"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/current-profile";
import { errorState, successState, type FormState } from "@/lib/forms/form-state";
import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ADMIN_PATH, ADMIN_USERS_PATH, buildAdminUserPath } from "./admin-paths";
import {
  createUserSchema,
  resetPasswordSchema,
  setUserActiveSchema,
  updateUserSchema,
  userIdSchema,
} from "./admin-schemas";
import { firstIssueMessage } from "./schema-feedback";

const BANNED_DURATION = "876000h";
const UNBANNED_DURATION = "none";
const SELF_PROTECTION_MESSAGE =
  "No podés hacer esto con tu propia cuenta. Pedile a otro administrador que lo haga.";
const GENERIC_FAILURE_MESSAGE = "No pudimos completar el cambio. Esperá unos segundos e intentá de nuevo.";

function revalidateUserPages(userId: string) {
  revalidatePath(ADMIN_PATH);
  revalidatePath(ADMIN_USERS_PATH);
  revalidatePath(buildAdminUserPath(userId));
}

export async function createUser(_previousState: FormState, formData: FormData): Promise<FormState> {
  await requireRole("admin");

  const parsed = createUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState(firstIssueMessage(parsed.error));

  const { fullName, email, password, role } = parsed.data;
  const adminClient = createSupabaseAdminClient();
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
    app_metadata: { role },
  });

  if (error?.code === "email_exists") {
    return errorState("Ya existe un usuario con ese email. Buscalo en el listado o usá otro email.");
  }
  if (error || !data.user) return errorState(GENERIC_FAILURE_MESSAGE);

  const { error: profileError } = await adminClient
    .from("profiles")
    .insert({ id: data.user.id, full_name: fullName, email, role });
  if (profileError) {
    await adminClient.auth.admin.deleteUser(data.user.id);
    return errorState(GENERIC_FAILURE_MESSAGE);
  }

  revalidatePath(ADMIN_PATH);
  revalidatePath(ADMIN_USERS_PATH);
  redirect(`${buildAdminUserPath(data.user.id)}?creado=1`);
}

export async function updateUser(_previousState: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireRole("admin");

  const parsed = updateUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState(firstIssueMessage(parsed.error));

  const { id, fullName, role } = parsed.data;
  if (id === admin.id && role !== "admin") return errorState(SELF_PROTECTION_MESSAGE);

  const { error: authError } = await createSupabaseAdminClient().auth.admin.updateUserById(id, {
    user_metadata: { full_name: fullName },
    app_metadata: { role },
  });
  if (authError) return errorState(GENERIC_FAILURE_MESSAGE);

  const supabase = await createSupabaseServerClient();
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: fullName, role })
    .eq("id", id);
  if (profileError) return errorState(GENERIC_FAILURE_MESSAGE);

  revalidateUserPages(id);
  return successState("Guardamos los datos del usuario.");
}

export async function resetUserPassword(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole("admin");

  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState(firstIssueMessage(parsed.error));

  const { error } = await createSupabaseAdminClient().auth.admin.updateUserById(parsed.data.id, {
    password: parsed.data.password,
  });
  if (error) return errorState(GENERIC_FAILURE_MESSAGE);

  return successState("Cambiamos la contraseña. Avisale a la persona cuál es la nueva.");
}

export async function setUserActive(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireRole("admin");

  const parsed = setUserActiveSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState(firstIssueMessage(parsed.error));

  const { id, active } = parsed.data;
  if (id === admin.id) return errorState(SELF_PROTECTION_MESSAGE);

  const { error: authError } = await createSupabaseAdminClient().auth.admin.updateUserById(id, {
    ban_duration: active ? UNBANNED_DURATION : BANNED_DURATION,
  });
  if (authError) return errorState(GENERIC_FAILURE_MESSAGE);

  const supabase = await createSupabaseServerClient();
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ is_active: active })
    .eq("id", id);
  if (profileError) return errorState(GENERIC_FAILURE_MESSAGE);

  revalidateUserPages(id);
  return successState(active ? "Reactivamos la cuenta." : "Desactivamos la cuenta.");
}

export async function deleteUser(_previousState: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireRole("admin");

  const parsed = userIdSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState(firstIssueMessage(parsed.error));
  if (parsed.data.id === admin.id) return errorState(SELF_PROTECTION_MESSAGE);

  const { error } = await createSupabaseAdminClient().auth.admin.deleteUser(parsed.data.id);
  if (error) return errorState(GENERIC_FAILURE_MESSAGE);

  revalidatePath(ADMIN_PATH);
  revalidatePath(ADMIN_USERS_PATH);
  redirect(ADMIN_USERS_PATH);
}
