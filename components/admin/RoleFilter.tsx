import Link from "next/link";
import { buildAdminUsersListPath } from "@/lib/admin/admin-paths";
import { roleLabels } from "@/lib/auth/roles";
import type { UserRole } from "@/types/database";

const filterRoles: UserRole[] = ["alumno", "docente", "admin"];

interface RoleFilterProps {
  activeRole: UserRole | null;
  searchTerm: string;
}

function buildFilterClasses(isActive: boolean): string {
  const stateClasses = isActive
    ? "border-navy bg-navy text-white"
    : "border-line bg-surface text-foreground hover:border-navy";
  return `inline-flex h-9 items-center rounded-sm border px-3 text-sm font-medium transition-colors ${stateClasses}`;
}

export function RoleFilter({ activeRole, searchTerm }: RoleFilterProps) {
  return (
    <nav aria-label="Filtrar por rol" className="flex flex-wrap gap-2">
      <Link
        href={buildAdminUsersListPath({ role: null, searchTerm })}
        aria-current={activeRole === null ? "page" : undefined}
        className={buildFilterClasses(activeRole === null)}
      >
        Todos
      </Link>
      {filterRoles.map((role) => (
        <Link
          key={role}
          href={buildAdminUsersListPath({ role, searchTerm })}
          aria-current={activeRole === role ? "page" : undefined}
          className={buildFilterClasses(activeRole === role)}
        >
          {roleLabels[role]}
        </Link>
      ))}
    </nav>
  );
}
