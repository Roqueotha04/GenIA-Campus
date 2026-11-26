import { StatusDot } from "@/components/ui/StatusDot";
import { formatMoment } from "@/lib/assignments/assignment-time";
import type { AssignmentRecord } from "@/lib/assignments/assignment-types";
import { getAssignmentWindow, type AssignmentWindow } from "@/lib/assignments/assignment-window";

function describeWindow(assignment: AssignmentRecord, window: AssignmentWindow): string {
  if (!assignment.due_at) return "Abierta, sin fecha límite";
  const dueMoment = formatMoment(assignment.due_at);
  if (window === "open") return `Abierta hasta el ${dueMoment}`;
  if (window === "late-allowed") return `Venció el ${dueMoment}, pero se aceptan entregas fuera de término`;
  return `Cerrada: venció el ${dueMoment}`;
}

interface AssignmentBriefProps {
  assignment: AssignmentRecord;
  attachmentUrl: string | null;
}

export function AssignmentBrief({ assignment, attachmentUrl }: AssignmentBriefProps) {
  const window = getAssignmentWindow(assignment);

  return (
    <div className="border border-line bg-surface p-5 md:p-8">
      <p className="flex items-center gap-2 text-sm text-muted">
        <StatusDot tone={window === "closed" ? "empty" : "available"} />
        {describeWindow(assignment, window)}
      </p>
      <p className="mt-1 text-sm text-muted">Nota máxima: {assignment.max_grade}</p>
      {assignment.instructions ? (
        <p className="mt-6 whitespace-pre-wrap break-words text-base leading-relaxed text-foreground">
          {assignment.instructions}
        </p>
      ) : (
        <p className="mt-6 text-sm text-muted">El docente no cargó una consigna escrita para esta entrega.</p>
      )}
      {assignment.attachment_name && (
        <p className="mt-6 text-sm">
          <span className="text-muted">Material del docente: </span>
          {attachmentUrl ? (
            <a href={attachmentUrl} className="break-all text-primary underline underline-offset-4">
              {assignment.attachment_name}
            </a>
          ) : (
            <span className="text-muted">{assignment.attachment_name} (recargá la página para descargarlo)</span>
          )}
        </p>
      )}
    </div>
  );
}
