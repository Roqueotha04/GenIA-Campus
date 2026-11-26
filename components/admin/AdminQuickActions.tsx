import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/ui/icons";
import { ADMIN_COURSES_PATH, ADMIN_USERS_PATH, buildNewEntityPath } from "@/lib/admin/admin-paths";

export function AdminQuickActions() {
  return (
    <>
      <Button href={buildNewEntityPath(ADMIN_USERS_PATH)} size="sm">
        <PlusIcon className="h-4 w-4" />
        Nuevo usuario
      </Button>
      <Button href={buildNewEntityPath(ADMIN_COURSES_PATH)} variant="outline" size="sm">
        <PlusIcon className="h-4 w-4" />
        Nuevo curso
      </Button>
    </>
  );
}
