import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import { createForumAction } from "@/lib/forums/forum-actions";
import { ForumForm } from "./ForumForm";

interface ForumResourceFormProps {
  sectionId: string;
  onCreated?: () => void;
}

export function ForumResourceForm({ sectionId, onCreated }: ForumResourceFormProps) {
  return (
    <ForumForm
      action={createForumAction}
      hiddenFields={{ sectionId }}
      submitLabel="Crear foro"
      pendingLabel="Creando…"
      onSuccess={onCreated}
    >
      <TextField label="Nombre del foro" name="title" required />
      <TextAreaField
        label="Introducción"
        name="intro"
        rows={4}
        hint="Opcional. Contá de qué se habla en este foro o qué esperás que compartan."
      />
    </ForumForm>
  );
}
