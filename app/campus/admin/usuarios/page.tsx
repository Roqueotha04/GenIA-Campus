import type { Metadata } from "next";
import { AdminPage } from "@/components/admin/AdminPage";
import { CreationPanelProvider } from "@/components/admin/CreationPanelProvider";
import { CreationSuccessAlert } from "@/components/admin/CreationSuccessAlert";
import { OpenCreationPanelButton } from "@/components/admin/OpenCreationPanelButton";
import { ResultCount } from "@/components/admin/ResultCount";
import { UserCreationPanel } from "@/components/admin/UserCreationPanel";
import { UserList } from "@/components/admin/UserList";
import { UserListToolbar } from "@/components/admin/UserListToolbar";
import { NEW_ENTITY_FLAG } from "@/lib/admin/admin-paths";
import { roleFilterSchema, searchTermSchema } from "@/lib/admin/admin-schemas";
import { listProfiles } from "@/lib/admin/admin-queries";

export const metadata: Metadata = { title: "Usuarios" };

interface AdminUsersPageProps {
  searchParams: Promise<{ rol?: string; q?: string; nuevo?: string }>;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const { rol, q, nuevo } = await searchParams;
  const activeRole = roleFilterSchema.parse(rol);
  const searchTerm = searchTermSchema.parse(q);
  const profiles = await listProfiles(activeRole, searchTerm);

  return (
    <CreationPanelProvider initiallyOpen={nuevo === NEW_ENTITY_FLAG}>
      <AdminPage
        title="Usuarios"
        subtitle="Todas las cuentas del campus. Buscá, filtrá por rol o entrá a una para editarla."
        actions={<OpenCreationPanelButton label="Nuevo usuario" />}
      >
        <CreationSuccessAlert />
        <UserListToolbar activeRole={activeRole} searchTerm={searchTerm} />
        <ResultCount count={profiles.length} singularLabel="usuario" pluralLabel="usuarios" />
        <UserList profiles={profiles} />
      </AdminPage>
      <UserCreationPanel />
    </CreationPanelProvider>
  );
}
