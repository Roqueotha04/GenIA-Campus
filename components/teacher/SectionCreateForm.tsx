import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import { createSectionAction } from "@/lib/teacher/section-actions";
import { ActionForm } from "./ActionForm";

export function SectionCreateForm({ courseId }: { courseId: string }) {
  return (
    <ActionForm
      action={createSectionAction}
      hiddenFields={{ courseId }}
      submitLabel="Crear sección"
      pendingLabel="Creando…"
    >
      <TextField label="Título de la sección" name="title" required hint="Por ejemplo: Clase 1" />
      <TextAreaField label="Descripción (opcional)" name="description" rows={3} />
    </ActionForm>
  );
}
