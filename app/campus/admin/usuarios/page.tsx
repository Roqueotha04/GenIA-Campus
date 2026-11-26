import type { Metadata } from "next";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { RoleFilter } from "@/components/admin/RoleFilter";
import { UserCreateForm } from "@/components/admin/UserCreateForm";
import { UserList } from "@/components/admin/UserList";
import { ADMIN_PATH } from "@/lib/admin/admin-paths";
import { roleFilterSchema } from "@/lib/admin/admin-schemas";
import { listProfiles } from "@/lib/admin/admin-queries";

export const metadata: Metadata = { title: "Usuarios" };

interface AdminUsersPageProps {
  searchParams: Promise<{ rol?: string }>;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const { rol } = await searchParams;
  const activeRole = roleFilterSchema.parse(rol);
  const profiles = await listProfiles(activeRole);

  return (
    <AdminPage
      breadcrumb={[
        { label: "Campus", href: "/campus" },
        { label: "Administración", href: ADMIN_PATH },
        { label: "Usuarios" },
      ]}
      title="Usuarios"
      subtitle="Todas las cuentas del campus. Filtrá por rol o entrá a una para editarla."
    >
      <RoleFilter activeRole={activeRole} />
      <UserList profiles={profiles} />
      <AdminPanel
        title="Crear usuario"
        description="La cuenta queda lista para ingresar con el email y la contraseña que cargues."
      >
        <UserCreateForm />
      </AdminPanel>
    </AdminPage>
  );
}
