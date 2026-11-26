import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordResetRequestForm } from "@/components/auth/PasswordResetRequestForm";
import { FormAlert } from "@/components/ui/FormAlert";

export const metadata: Metadata = { title: "Recuperar clave" };

interface RecoverPageProps {
  searchParams: Promise<{ link?: string }>;
}

export default async function RecoverPasswordPage({ searchParams }: RecoverPageProps) {
  const { link } = await searchParams;

  return (
    <AuthLayout
      title="Recuperar clave"
      description="Ingresá tu email y te mandamos un link para elegir una clave nueva."
    >
      {link === "vencido" && (
        <div className="mb-4">
          <FormAlert tone="error" message="El link venció o ya se usó. Pedí uno nuevo." />
        </div>
      )}
      <PasswordResetRequestForm />
    </AuthLayout>
  );
}
