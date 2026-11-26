import { TextField } from "@/components/ui/TextField";
import { createLinkResourceAction } from "@/lib/teacher/resource-actions";
import { ActionForm } from "./ActionForm";

export function LinkResourceForm({ sectionId }: { sectionId: string }) {
  return (
    <ActionForm
      action={createLinkResourceAction}
      hiddenFields={{ sectionId }}
      submitLabel="Agregar enlace"
      pendingLabel="Agregando…"
    >
      <TextField label="Título del enlace" name="title" required />
      <TextField label="Dirección" name="url" type="url" required hint="Tiene que empezar con http:// o https://" />
    </ActionForm>
  );
}
