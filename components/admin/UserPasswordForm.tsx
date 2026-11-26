import { TextField } from "@/components/ui/TextField";
import { resetUserPassword } from "@/lib/admin/user-actions";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/roles";
import { AdminForm } from "./AdminForm";

export function UserPasswordForm({ userId }: { userId: string }) {
  return (
    <AdminForm
      action={resetUserPassword}
      submitLabel="Cambiar contraseña"
      pendingLabel="Cambiando..."
      variant="outline"
    >
      <input type="hidden" name="id" value={userId} />
      <TextField
        label="Contraseña nueva"
        name="password"
        type="password"
        autoComplete="new-password"
        hint={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres.`}
        required
      />
    </AdminForm>
  );
}
