import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import { createSectionAction } from "@/lib/teacher/section-actions";
import { ActionForm } from "./ActionForm";

interface SectionCreateFormProps {
  courseId: string;
  onCreated?: () => void;
}

export function SectionCreateForm({ courseId, onCreated }: SectionCreateFormProps) {
  return (
    <ActionForm
      action={createSectionAction}
      hiddenFields={{ courseId }}
      submitLabel="Crear sección"
      pendingLabel="Creando…"
      onSuccess={onCreated}
    >
      <TextField label="Título de la sección" name="title" required hint="Por ejemplo: Clase 1" />
      <TextAreaField label="Descripción (opcional)" name="description" rows={3} />
    </ActionForm>
  );
}
