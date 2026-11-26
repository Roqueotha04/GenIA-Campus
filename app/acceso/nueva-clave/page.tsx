import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { NewPasswordForm } from "@/components/auth/NewPasswordForm";
import { getCurrentProfile } from "@/lib/auth/current-profile";

export const metadata: Metadata = { title: "Clave nueva" };

export default async function NewPasswordPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/acceso/recuperar?link=vencido");

  return (
    <AuthLayout title="Elegí tu clave nueva" description="Vas a usarla para ingresar al campus.">
      <NewPasswordForm />
    </AuthLayout>
  );
}
