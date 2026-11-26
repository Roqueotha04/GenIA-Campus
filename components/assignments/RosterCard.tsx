import type { RosterEntry } from "@/lib/assignments/assignment-queries";
import { StatusDot } from "@/components/ui/StatusDot";
import { GradeForm } from "./GradeForm";
import { SubmissionContent } from "./SubmissionContent";

interface RosterCardProps {
  entry: RosterEntry;
  dueAt: string | null;
  maxGrade: number;
}

function describeStatus({ submission }: RosterEntry): string {
  if (!submission) return "Sin entregar";
  return submission.grade === null ? "Entregado" : "Corregido";
}

export function RosterCard({ entry, dueAt, maxGrade }: RosterCardProps) {
  const { submission } = entry;

  return (
    <li className="border border-line bg-surface p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words font-medium text-foreground">{entry.name}</p>
          <p className="break-all text-sm text-muted">{entry.email}</p>
        </div>
        <p className="flex items-center gap-2 text-sm text-muted">
          <StatusDot tone={submission ? "available" : "empty"} />
          {describeStatus(entry)}
        </p>
      </div>

      {submission && (
        <div className="mt-5 grid gap-6 border-t border-line pt-5 md:grid-cols-2">
          <SubmissionContent submission={submission} dueAt={dueAt} />
          <GradeForm
            submissionId={submission.id}
            maxGrade={maxGrade}
            grade={submission.grade}
            feedback={submission.feedback}
          />
        </div>
      )}
    </li>
  );
}
