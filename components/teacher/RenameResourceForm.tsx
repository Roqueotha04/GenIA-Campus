import { TextField } from "@/components/ui/TextField";
import { renameResourceAction } from "@/lib/teacher/resource-actions";
import { ActionForm } from "./ActionForm";

interface RenameResourceFormProps {
  resourceId: string;
  title: string;
  onSaved?: () => void;
}

export function RenameResourceForm({ resourceId, title, onSaved }: RenameResourceFormProps) {
  return (
    <ActionForm
      action={renameResourceAction}
      hiddenFields={{ resourceId }}
      submitLabel="Guardar nombre"
      pendingLabel="Guardando…"
      onSuccess={onSaved}
    >
      <TextField label="Nombre" name="title" defaultValue={title} required />
    </ActionForm>
  );
}
