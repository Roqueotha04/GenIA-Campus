import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import { updateSectionAction } from "@/lib/teacher/section-actions";
import { ActionForm } from "./ActionForm";

interface SectionEditFormProps {
  sectionId: string;
  title: string;
  description: string;
  onSaved?: () => void;
}

export function SectionEditForm({ sectionId, title, description, onSaved }: SectionEditFormProps) {
  return (
    <ActionForm
      action={updateSectionAction}
      hiddenFields={{ sectionId }}
      submitLabel="Guardar cambios"
      pendingLabel="Guardando…"
      onSuccess={onSaved}
    >
      <TextField label="Título" name="title" defaultValue={title} required />
      <TextAreaField label="Descripción" name="description" defaultValue={description} rows={3} />
    </ActionForm>
  );
}
