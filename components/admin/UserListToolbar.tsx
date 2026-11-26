import type { UserRole } from "@/types/database";
import { RoleFilter } from "./RoleFilter";
import { UserSearchForm } from "./UserSearchForm";

interface UserListToolbarProps {
  activeRole: UserRole | null;
  searchTerm: string;
}

export function UserListToolbar({ activeRole, searchTerm }: UserListToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <UserSearchForm activeRole={activeRole} searchTerm={searchTerm} />
      <RoleFilter activeRole={activeRole} searchTerm={searchTerm} />
    </div>
  );
}
