import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import type { AdminProfile } from "@/lib/admin/admin-queries";
import { updateUser } from "@/lib/admin/user-actions";
import { AdminForm } from "./AdminForm";
import { roleSelectOptions } from "./roleSelectOptions";

export function UserEditForm({ profile }: { profile: AdminProfile }) {
  return (
    <AdminForm action={updateUser} submitLabel="Guardar cambios" pendingLabel="Guardando...">
      <input type="hidden" name="id" value={profile.id} />
      <TextField label="Nombre completo" name="fullName" defaultValue={profile.full_name} required />
      <SelectField label="Rol" name="role" options={roleSelectOptions} defaultValue={profile.role} required />
    </AdminForm>
  );
}
