import { roleLabels } from "@/lib/auth/roles";
import type { UserRole } from "@/types/database";

const roleToneClasses: Record<UserRole, string> = {
  admin: "border-navy/30 bg-navy/5 text-navy",
  docente: "border-primary/30 bg-primary/10 text-primary",
  alumno: "border-line bg-background text-foreground",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium ${roleToneClasses[role]}`}
    >
      {roleLabels[role]}
    </span>
  );
}
