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
      <SectionHeading title="Avisos" />
      <div className="mt-6 rounded-sm border border-line bg-surface p-4 md:p-5">
        <p className="mb-4 text-sm font-semibold text-foreground">Nuevo aviso</p>
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
        <p className="mt-6 text-sm text-muted">Todavía no publicaste avisos. Los alumnos los ven apenas los publicás.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {notices.map((notice) => (
            <li key={notice.id} className="rounded-sm border border-line bg-surface p-4">
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
