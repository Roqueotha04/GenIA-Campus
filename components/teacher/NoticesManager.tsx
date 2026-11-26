import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import type { ManagedNotice } from "@/lib/teacher/load-course-management";
import { createNoticeAction, deleteNoticeAction } from "@/lib/teacher/notice-actions";
import { ActionForm } from "./ActionForm";
import { ConfirmActionForm } from "./ConfirmActionForm";

interface NoticesManagerProps {
  courseId: string;
  notices: ManagedNotice[];
}

const noticeDateFormat = new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" });

export function NoticesManager({ courseId, notices }: NoticesManagerProps) {
  return (
    <div>
      <SectionHeading title="Avisos" eyebrow="Comunicación" />
      <div className="mt-8 border border-line bg-surface p-5 md:p-8">
        <p className="mb-4 font-medium text-foreground">Nuevo aviso</p>
        <ActionForm
          action={createNoticeAction}
          hiddenFields={{ courseId }}
          submitLabel="Publicar aviso"
          pendingLabel="Publicando…"
        >
          <TextField label="Título" name="title" required />
          <TextAreaField label="Mensaje" name="body" required rows={4} />
        </ActionForm>
      </div>
      {notices.length === 0 ? (
        <p className="mt-8 text-muted">Todavía no publicaste avisos. Los alumnos los ven apenas los publicás.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {notices.map((notice) => (
            <li key={notice.id} className="border border-line bg-surface p-5">
              <p className="text-xs text-muted">{noticeDateFormat.format(new Date(notice.created_at))}</p>
              <p className="mt-1 font-medium text-foreground">{notice.title}</p>
              <p className="mt-2 whitespace-pre-line text-sm text-muted">{notice.body}</p>
              <div className="mt-4">
                <ConfirmActionForm
                  action={deleteNoticeAction}
                  hiddenFields={{ noticeId: notice.id }}
                  label="Eliminar aviso"
                  confirmLabel="Sí, eliminar"
                  pendingLabel="Eliminando…"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
