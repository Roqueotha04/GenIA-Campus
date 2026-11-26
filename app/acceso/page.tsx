import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentProfile } from "@/lib/auth/current-profile";
import { CAMPUS_PATH } from "@/lib/auth/roles";

export const metadata: Metadata = { title: "Acceso" };

export default async function AccessPage() {
  const profile = await getCurrentProfile();
  if (profile) redirect(CAMPUS_PATH);

  return (
    <AuthLayout title="Acceder al campus" description="Ingresá con tu email y tu clave.">
      <LoginForm />
    </AuthLayout>
  );
}
