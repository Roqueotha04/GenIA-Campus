import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import { updateForumAction } from "@/lib/forums/forum-actions";
import type { ForumRecord } from "@/lib/forums/forum-types";
import { ForumForm } from "./ForumForm";

interface ForumEditFormProps {
  forum: ForumRecord;
  onSaved?: () => void;
}

export function ForumEditForm({ forum, onSaved }: ForumEditFormProps) {
  return (
    <ForumForm
      action={updateForumAction}
      hiddenFields={{ forumId: forum.id }}
      submitLabel="Guardar cambios"
      pendingLabel="Guardando…"
      onSuccess={onSaved}
    >
      <TextField label="Nombre del foro" name="title" defaultValue={forum.title} required />
      <TextAreaField label="Introducción" name="intro" defaultValue={forum.intro} rows={4} hint="Opcional." />
    </ForumForm>
  );
}
