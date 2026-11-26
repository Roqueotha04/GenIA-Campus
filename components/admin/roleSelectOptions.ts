import type { SelectOption } from "@/components/ui/SelectField";
import { roleLabels } from "@/lib/auth/roles";
import type { UserRole } from "@/types/database";

const roleOrder: UserRole[] = ["alumno", "docente", "admin"];

export const roleSelectOptions: SelectOption[] = roleOrder.map((role) => ({
  value: role,
  label: roleLabels[role],
}));
