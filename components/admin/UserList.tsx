import Link from "next/link";
import { buildAdminUserPath } from "@/lib/admin/admin-paths";
import type { AdminProfile } from "@/lib/admin/admin-queries";
import { formatAdminDate } from "@/lib/admin/format-admin-date";
import { ActiveStatus } from "./ActiveStatus";
import { AdminEmptyState } from "./AdminEmptyState";
import { AdminTable } from "./AdminTable";
import { RoleBadge } from "./RoleBadge";

const userTableColumns = ["Nombre", "Email", "Rol", "Estado", "Alta"];

function UserCard({ profile }: { profile: AdminProfile }) {
  return (
    <li>
      <Link
        href={buildAdminUserPath(profile.id)}
        className="block rounded-sm border border-line bg-surface p-3 transition-colors hover:border-navy"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 font-medium text-foreground">{profile.full_name}</p>
          <RoleBadge role={profile.role} />
        </div>
        <p className="mt-0.5 break-all text-sm text-muted">{profile.email}</p>
        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted">
          <ActiveStatus isActive={profile.is_active} />
          <span>Alta {formatAdminDate(profile.created_at)}</span>
        </div>
      </Link>
    </li>
  );
}

function UserRow({ profile }: { profile: AdminProfile }) {
  return (
    <tr className="relative transition-colors hover:bg-background">
      <td className="px-4 py-2.5 font-medium text-foreground">
        <Link
          href={buildAdminUserPath(profile.id)}
          className="after:absolute after:inset-0 hover:text-primary"
        >
          {profile.full_name}
        </Link>
      </td>
      <td className="px-4 py-2.5 text-muted">{profile.email}</td>
      <td className="px-4 py-2.5">
        <RoleBadge role={profile.role} />
      </td>
      <td className="px-4 py-2.5">
        <ActiveStatus isActive={profile.is_active} />
      </td>
      <td className="whitespace-nowrap px-4 py-2.5 text-muted">{formatAdminDate(profile.created_at)}</td>
    </tr>
  );
}

export function UserList({ profiles }: { profiles: AdminProfile[] }) {
  if (profiles.length === 0) {
    return (
      <AdminEmptyState message="No encontramos usuarios con esta búsqueda o filtro. Probá con otro término o creá uno con «Nuevo usuario»." />
    );
  }

  return (
    <>
      <ul className="space-y-2 md:hidden">
        {profiles.map((profile) => (
          <UserCard key={profile.id} profile={profile} />
        ))}
      </ul>
      <AdminTable columns={userTableColumns}>
        {profiles.map((profile) => (
          <UserRow key={profile.id} profile={profile} />
        ))}
      </AdminTable>
    </>
  );
}
