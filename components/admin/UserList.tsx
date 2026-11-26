import Link from "next/link";
import { buildAdminUserPath } from "@/lib/admin/admin-paths";
import type { AdminProfile } from "@/lib/admin/admin-queries";
import { roleLabels } from "@/lib/auth/roles";
import { ActiveStatus } from "./ActiveStatus";
import { AdminEmptyState } from "./AdminEmptyState";

function UserCard({ profile }: { profile: AdminProfile }) {
  return (
    <li>
      <Link
        href={buildAdminUserPath(profile.id)}
        className="block rounded-sm border border-line bg-surface p-4 transition-colors hover:border-navy"
      >
        <p className="font-medium text-foreground">{profile.full_name}</p>
        <p className="mt-1 break-all text-sm text-muted">{profile.email}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
            {roleLabels[profile.role]}
          </span>
          <ActiveStatus isActive={profile.is_active} />
        </div>
      </Link>
    </li>
  );
}

function UserRow({ profile }: { profile: AdminProfile }) {
  return (
    <tr className="border-t border-line">
      <td className="px-4 py-3 font-medium text-foreground">{profile.full_name}</td>
      <td className="px-4 py-3 text-muted">{profile.email}</td>
      <td className="px-4 py-3 text-foreground">{roleLabels[profile.role]}</td>
      <td className="px-4 py-3">
        <ActiveStatus isActive={profile.is_active} />
      </td>
      <td className="px-4 py-3 text-right">
        <Link
          href={buildAdminUserPath(profile.id)}
          className="text-sm font-semibold text-primary hover:text-navy"
        >
          Editar
        </Link>
      </td>
    </tr>
  );
}

function UserTable({ profiles }: { profiles: AdminProfile[] }) {
  return (
    <div className="hidden overflow-x-auto rounded-sm border border-line bg-surface md:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-[0.18em] text-muted">
            <th scope="col" className="px-4 py-3 font-medium">Nombre</th>
            <th scope="col" className="px-4 py-3 font-medium">Email</th>
            <th scope="col" className="px-4 py-3 font-medium">Rol</th>
            <th scope="col" className="px-4 py-3 font-medium">Estado</th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <UserRow key={profile.id} profile={profile} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function UserList({ profiles }: { profiles: AdminProfile[] }) {
  if (profiles.length === 0) {
    return (
      <AdminEmptyState message="No hay usuarios con este filtro. Cambiá el filtro o creá uno desde el formulario de abajo." />
    );
  }

  return (
    <>
      <ul className="space-y-3 md:hidden">
        {profiles.map((profile) => (
          <UserCard key={profile.id} profile={profile} />
        ))}
      </ul>
      <UserTable profiles={profiles} />
    </>
  );
}
