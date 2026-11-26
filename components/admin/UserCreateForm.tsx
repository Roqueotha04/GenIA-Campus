import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import { createUser } from "@/lib/admin/user-actions";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/roles";
import { AdminForm } from "./AdminForm";
import { roleSelectOptions } from "./roleSelectOptions";

export function UserCreateForm({ onSuccess }: { onSuccess: (message: string) => void }) {
  return (
    <AdminForm
      action={createUser}
      submitLabel="Crear usuario"
      pendingLabel="Creando usuario..."
      onSuccess={onSuccess}
    >
      <p className="text-sm text-muted">
        La cuenta queda lista para ingresar con el email y la contraseña que cargues.
      </p>
      <TextField label="Nombre completo" name="fullName" autoComplete="off" required />
      <TextField label="Email" name="email" type="email" autoComplete="off" required />
      <TextField
        label="Contraseña inicial"
        name="password"
        type="password"
        autoComplete="new-password"
        hint={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres. La persona puede cambiarla después.`}
        required
      />
      <SelectField label="Rol" name="role" options={roleSelectOptions} defaultValue="alumno" required />
    </AdminForm>
  );
}
