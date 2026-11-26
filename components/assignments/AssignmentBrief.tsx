import { StatusDot } from "@/components/ui/StatusDot";
import { formatMoment } from "@/lib/assignments/assignment-time";
import type { AssignmentRecord } from "@/lib/assignments/assignment-types";
import { getAssignmentWindow, type AssignmentWindow } from "@/lib/assignments/assignment-window";

const windowLabels: Record<AssignmentWindow, string> = {
  open: "Abierta",
  late: "Fuera de término",
  closed: "Cerrada",
};

function AssignmentDeadlines({ assignment }: { assignment: AssignmentRecord }) {
  return (
    <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-3">
      <dt className="text-muted">Fecha de entrega:</dt>
      <dd className="text-foreground">{assignment.due_at ? formatMoment(assignment.due_at) : "Sin fecha"}</dd>
      <dt className="text-muted">Cierra:</dt>
      <dd className="text-foreground">
        {assignment.cutoff_at ? formatMoment(assignment.cutoff_at) : "No cierra"}
      </dd>
      <dt className="text-muted">Nota máxima:</dt>
      <dd className="text-foreground">{assignment.max_grade}</dd>
    </dl>
  );
}

function LateWindowNote({ cutoffAt }: { cutoffAt: string | null }) {
  return (
    <p className="mt-4 border-l-2 border-primary pl-3 text-sm text-foreground">
      {cutoffAt
        ? `La fecha de entrega pasó, pero todavía podés entregar hasta el ${formatMoment(cutoffAt)}.`
        : "La fecha de entrega pasó, pero todavía podés entregar."}
    </p>
  );
}

interface AssignmentBriefProps {
  assignment: AssignmentRecord;
  attachmentUrl: string | null;
}

export function AssignmentBrief({ assignment, attachmentUrl }: AssignmentBriefProps) {
  const assignmentWindow = getAssignmentWindow(assignment);

  return (
    <div className="rounded-sm border border-line bg-surface p-5 md:p-6">
      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
        <StatusDot tone={assignmentWindow === "closed" ? "empty" : "available"} />
        {windowLabels[assignmentWindow]}
      </p>
      <AssignmentDeadlines assignment={assignment} />
      {assignmentWindow === "late" && <LateWindowNote cutoffAt={assignment.cutoff_at} />}
      {assignment.instructions ? (
        <p className="mt-5 whitespace-pre-wrap break-words text-base leading-relaxed text-foreground">
          {assignment.instructions}
        </p>
      ) : (
        <p className="mt-5 text-sm text-muted">El docente no cargó una consigna escrita para esta tarea.</p>
      )}
      {assignment.attachment_name && (
        <p className="mt-5 text-sm">
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
