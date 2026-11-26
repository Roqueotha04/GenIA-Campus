import { ConfirmActionForm } from "@/components/teacher/ConfirmActionForm";
import { deletePostAction, deleteTopicAction } from "@/lib/forums/forum-actions";
import type { ForumPostKind } from "@/lib/forums/forum-types";

const deletionSettings = {
  topic: {
    action: deleteTopicAction,
    fieldName: "topicId",
    label: "Eliminar tema",
    confirmLabel: "Sí, eliminar tema",
    warning: "Se borra el tema con todas sus respuestas. No se puede deshacer.",
  },
  reply: {
    action: deletePostAction,
    fieldName: "postId",
    label: "Eliminar",
    confirmLabel: "Sí, eliminar",
    warning: "La respuesta se borra para todo el curso. No se puede deshacer.",
  },
} as const;

interface PostDeleteFormProps {
  postId: string;
  kind: ForumPostKind;
}

export function PostDeleteForm({ postId, kind }: PostDeleteFormProps) {
  const settings = deletionSettings[kind];

  return (
    <ConfirmActionForm
      action={settings.action}
      hiddenFields={{ [settings.fieldName]: postId }}
      label={settings.label}
      confirmLabel={settings.confirmLabel}
      pendingLabel="Eliminando…"
      warning={settings.warning}
    />
  );
}
