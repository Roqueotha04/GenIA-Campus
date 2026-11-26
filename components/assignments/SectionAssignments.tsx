import type { ManagedAssignment } from "@/lib/assignments/assignment-types";
import { AssignmentForm } from "./AssignmentForm";
import { AssignmentManageItem } from "./AssignmentManageItem";

interface SectionAssignmentsProps {
  sectionId: string;
  assignments: ManagedAssignment[];
}

export function SectionAssignments({ sectionId, assignments }: SectionAssignmentsProps) {
  return (
    <div className="border-t border-line pt-5">
      <p className="text-sm font-medium text-foreground">Entregas</p>
      {assignments.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          Esta sección todavía no tiene entregas. Creá una para que los alumnos suban sus trabajos.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {assignments.map((assignment) => (
            <AssignmentManageItem key={assignment.id} assignment={assignment} />
          ))}
        </ul>
      )}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-primary">Crear entrega</summary>
        <div className="mt-3">
          <AssignmentForm mode="create" sectionId={sectionId} />
        </div>
      </details>
    </div>
  );
}
