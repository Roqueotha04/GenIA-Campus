import { setUserActive } from "@/lib/admin/user-actions";
import { ActiveStatus } from "./ActiveStatus";
import { AdminForm } from "./AdminForm";

export function UserActivationForm({ userId, isActive }: { userId: string; isActive: boolean }) {
  return (
    <div className="space-y-4">
      <ActiveStatus
        isActive={isActive}
        activeLabel="La cuenta está activa"
        inactiveLabel="La cuenta está desactivada"
      />
      <AdminForm
        action={setUserActive}
        submitLabel={isActive ? "Desactivar cuenta" : "Reactivar cuenta"}
        pendingLabel="Guardando..."
        variant="outline"
      >
        <input type="hidden" name="id" value={userId} />
        <input type="hidden" name="active" value={isActive ? "false" : "true"} />
      </AdminForm>
    </div>
  );
}
