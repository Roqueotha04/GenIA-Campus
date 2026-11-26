import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { TableRow, UserRole } from "@/types/database";
import { isGuestAccessOpen, isGuestEmail } from "./guest-access";
import { CAMPUS_PATH, LOGIN_PATH } from "./roles";

export type CurrentProfile = Pick<TableRow<"profiles">, "id" | "full_name" | "email" | "role"> & {
  isGuest: boolean;
};

export const getCurrentProfile = cache(async (): Promise<CurrentProfile | null> => {
  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, is_active")
    .eq("id", userId)
    .maybeSingle();

  if (!profile || !profile.is_active) return null;

  const isGuest = isGuestEmail(profile.email);
  if (isGuest && !isGuestAccessOpen()) return null;

  return {
    id: profile.id,
    full_name: profile.full_name,
    email: profile.email,
    role: profile.role,
    isGuest,
  };
});

export async function requireProfile(): Promise<CurrentProfile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect(LOGIN_PATH);
  return profile;
}

export async function requireRole(...allowedRoles: UserRole[]): Promise<CurrentProfile> {
  const profile = await requireProfile();
  if (!allowedRoles.includes(profile.role)) redirect(CAMPUS_PATH);
  return profile;
}
