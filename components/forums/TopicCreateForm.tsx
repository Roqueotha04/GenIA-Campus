import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import { createTopicAction } from "@/lib/forums/forum-actions";
import { ForumForm } from "./ForumForm";

export function TopicCreateForm({ forumId }: { forumId: string }) {
  return (
    <ForumForm
      action={createTopicAction}
      hiddenFields={{ forumId }}
      submitLabel="Publicar tema"
      pendingLabel="Publicando…"
    >
      <TextField label="Título del tema" name="title" required />
      <TextAreaField label="Mensaje" name="body" rows={6} required />
    </ForumForm>
  );
}
