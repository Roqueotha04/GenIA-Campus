import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminDetailLayout } from "@/components/admin/AdminDetailLayout";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { ConfirmActionForm } from "@/components/admin/ConfirmActionForm";
import { ProfileCoursesPanel } from "@/components/admin/ProfileCoursesPanel";
import { RoleBadge } from "@/components/admin/RoleBadge";
import { UserActivationForm } from "@/components/admin/UserActivationForm";
import { UserEditForm } from "@/components/admin/UserEditForm";
import { UserPasswordForm } from "@/components/admin/UserPasswordForm";
import { FormAlert } from "@/components/ui/FormAlert";
import { ADMIN_USERS_PATH } from "@/lib/admin/admin-paths";
import { userIdSchema } from "@/lib/admin/admin-schemas";
import { findProfile, findProfileCourseMembership } from "@/lib/admin/admin-queries";
import { deleteUser } from "@/lib/admin/user-actions";
import { requireRole } from "@/lib/auth/current-profile";

export const metadata: Metadata = { title: "Editar usuario" };

interface AdminUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserPage({ params }: AdminUserPageProps) {
  const [{ id }, currentAdmin] = await Promise.all([params, requireRole("admin")]);

  const parsedId = userIdSchema.safeParse({ id });
  if (!parsedId.success) notFound();

  const profile = await findProfile(parsedId.data.id);
  if (!profile) notFound();

  const membership = await findProfileCourseMembership(profile);
  const isOwnAccount = profile.id === currentAdmin.id;

  return (
    <AdminPage
      backLink={{ href: ADMIN_USERS_PATH, label: "Usuarios" }}
      title={profile.full_name}
      subtitle={profile.email}
      actions={<RoleBadge role={profile.role} />}
    >
      {isOwnAccount && (
        <FormAlert
          tone="error"
          message="Esta es tu propia cuenta: no podés cambiarte el rol, desactivarla ni eliminarla."
        />
      )}
      <AdminDetailLayout
        aside={
          <>
            {!isOwnAccount && (
              <AdminPanel
                title="Acceso"
                description="Una cuenta desactivada no puede ingresar, pero conserva su historial y sus inscripciones."
              >
                <UserActivationForm userId={profile.id} isActive={profile.is_active} />
              </AdminPanel>
            )}
            <ProfileCoursesPanel profileId={profile.id} membership={membership} />
            {!isOwnAccount && (
              <AdminPanel
                title="Eliminar usuario"
                description="Borra la cuenta y todo lo asociado: inscripciones, asignaciones e intentos. No se puede deshacer."
              >
                <ConfirmActionForm
                  action={deleteUser}
                  hiddenFields={{ id: profile.id }}
                  label="Eliminar usuario"
                  confirmLabel="Confirmar eliminación"
                  pendingLabel="Eliminando..."
                />
              </AdminPanel>
            )}
          </>
        }
      >
        <AdminPanel title="Datos de la cuenta">
          <UserEditForm profile={profile} />
        </AdminPanel>
        <AdminPanel
          title="Contraseña"
          description="Definí una contraseña nueva. La anterior deja de funcionar al instante."
        >
          <UserPasswordForm userId={profile.id} />
        </AdminPanel>
      </AdminDetailLayout>
    </AdminPage>
  );
}
