import { TextAreaField } from "@/components/ui/TextAreaField";
import { replyToTopicAction } from "@/lib/forums/forum-actions";
import { ForumForm } from "./ForumForm";

export function ReplyForm({ topicId }: { topicId: string }) {
  return (
    <ForumForm
      action={replyToTopicAction}
      hiddenFields={{ topicId }}
      submitLabel="Responder"
      pendingLabel="Publicando…"
    >
      <TextAreaField label="Tu respuesta" name="body" rows={5} required />
    </ForumForm>
  );
}
