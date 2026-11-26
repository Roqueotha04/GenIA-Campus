import Form from "next/form";
import { ActionButton } from "@/components/ui/Button";
import { ADMIN_USERS_PATH } from "@/lib/admin/admin-paths";
import type { UserRole } from "@/types/database";
import { AdminSearchField } from "./AdminSearchField";

interface UserSearchFormProps {
  activeRole: UserRole | null;
  searchTerm: string;
}

export function UserSearchForm({ activeRole, searchTerm }: UserSearchFormProps) {
  return (
    <Form action={ADMIN_USERS_PATH} role="search" className="flex w-full gap-2 md:max-w-sm">
      {activeRole && <input type="hidden" name="rol" value={activeRole} />}
      <AdminSearchField
        name="q"
        label="Buscar usuarios"
        placeholder="Buscar por nombre o email"
        defaultValue={searchTerm}
      />
      <ActionButton type="submit" variant="outline" size="sm">
        Buscar
      </ActionButton>
    </Form>
  );
}
