import { ConfirmActionForm } from "@/components/teacher/ConfirmActionForm";
import { Button } from "@/components/ui/Button";
import { deleteAssignmentAction } from "@/lib/assignments/assignment-actions";
import { formatMoment } from "@/lib/assignments/assignment-time";
import type { ManagedAssignment } from "@/lib/assignments/assignment-types";
import { AssignmentForm } from "./AssignmentForm";

function describeDeadline(assignment: ManagedAssignment): string {
  if (!assignment.due_at) return "Sin fecha límite";
  return `Hasta el ${formatMoment(assignment.due_at)}`;
}

export function AssignmentManageItem({ assignment }: { assignment: ManagedAssignment }) {
  return (
    <li className="border border-line bg-surface p-4">
      <p className="break-words font-medium text-foreground">{assignment.title}</p>
      <p className="mt-1 text-sm text-muted">{describeDeadline(assignment)}</p>
      <p className="mt-1 text-sm text-muted">
        {assignment.submittedCount} de {assignment.enrolledCount} entregaron
      </p>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <Button href={assignment.href} variant="outline" size="sm">
          Ver entregas
        </Button>
        <ConfirmActionForm
          action={deleteAssignmentAction}
          hiddenFields={{ assignmentId: assignment.id }}
          label="Eliminar"
          confirmLabel="Sí, eliminar"
          pendingLabel="Eliminando…"
          warning="Se borran también las entregas de los alumnos y sus archivos. No se puede deshacer."
        />
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-primary">Editar entrega</summary>
        <div className="mt-3">
          <AssignmentForm mode="edit" assignment={assignment} />
        </div>
      </details>
    </li>
  );
}
