import type { AssignmentRecord } from "@/lib/assignments/assignment-types";
import type { RosterEntry } from "@/lib/assignments/assignment-queries";
import { RosterCard } from "./RosterCard";

interface TeacherSubmissionsPanelProps {
  assignment: AssignmentRecord;
  roster: RosterEntry[];
}

export function TeacherSubmissionsPanel({ assignment, roster }: TeacherSubmissionsPanelProps) {
  const submittedCount = roster.filter((entry) => entry.submission).length;

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground">Entregas de los alumnos</h2>
      <p className="mt-2 text-sm text-muted">
        {submittedCount} de {roster.length} entregaron.
      </p>
      {roster.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          Todavía no hay alumnos inscriptos. Cuando se inscriban con la clave del curso, van a aparecer acá.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {roster.map((entry) => (
            <RosterCard
              key={entry.studentId}
              entry={entry}
              dueAt={assignment.due_at}
              maxGrade={assignment.max_grade}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
