import Link from "next/link";
import { ADMIN_USERS_PATH } from "@/lib/admin/admin-paths";
import { roleLabels } from "@/lib/auth/roles";
import type { UserRole } from "@/types/database";

const filterRoles: UserRole[] = ["admin", "docente", "alumno"];

function buildFilterClasses(isActive: boolean): string {
  const stateClasses = isActive
    ? "border-navy bg-navy text-white"
    : "border-line text-foreground hover:border-navy";
  return `inline-flex h-10 items-center rounded-sm border px-4 text-sm font-medium transition-colors ${stateClasses}`;
}

export function RoleFilter({ activeRole }: { activeRole: UserRole | null }) {
  return (
    <nav aria-label="Filtrar por rol" className="flex flex-wrap gap-2">
      <Link href={ADMIN_USERS_PATH} className={buildFilterClasses(activeRole === null)}>
        Todos
      </Link>
      {filterRoles.map((role) => (
        <Link
          key={role}
          href={`${ADMIN_USERS_PATH}?rol=${role}`}
          className={buildFilterClasses(activeRole === role)}
        >
          {roleLabels[role]}
        </Link>
      ))}
    </nav>
  );
}
