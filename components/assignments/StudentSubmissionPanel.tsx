import { FormAlert } from "@/components/ui/FormAlert";
import type { AssignmentRecord } from "@/lib/assignments/assignment-types";
import type { SubmissionView } from "@/lib/assignments/assignment-queries";
import { getClosedMessage } from "@/lib/assignments/assignment-window";
import { SubmissionContent } from "./SubmissionContent";
import { SubmissionForm } from "./SubmissionForm";

interface StudentSubmissionPanelProps {
  assignment: AssignmentRecord;
  submission: SubmissionView | null;
}

function GradeResult({ submission, maxGrade }: { submission: SubmissionView; maxGrade: number }) {
  if (submission.grade === null) {
    return <p className="text-sm text-muted">Tu docente todavía no corrigió esta entrega.</p>;
  }

  return (
    <div className="space-y-2 border-l-2 border-primary pl-4">
      <p className="text-sm font-medium text-foreground">
        Nota: {submission.grade} / {maxGrade}
      </p>
      {submission.feedback && (
        <p className="whitespace-pre-wrap break-words text-sm text-muted">{submission.feedback}</p>
      )}
    </div>
  );
}

export function StudentSubmissionPanel({ assignment, submission }: StudentSubmissionPanelProps) {
  const closedMessage = getClosedMessage(assignment);

  return (
    <div className="space-y-8">
      {submission && (
        <div className="space-y-4 rounded-sm border border-line bg-surface p-5 md:p-6">
          <h2 className="text-lg font-semibold text-foreground">Tu entrega</h2>
          <SubmissionContent submission={submission} dueAt={assignment.due_at} />
          <GradeResult submission={submission} maxGrade={assignment.max_grade} />
        </div>
      )}

      {closedMessage ? (
        <FormAlert tone="error" message={closedMessage} />
      ) : (
        <div className="rounded-sm border border-line bg-surface p-5 md:p-6">
          <h2 className="text-lg font-semibold text-foreground">
            {submission ? "Reenviar entrega" : "Hacer la entrega"}
          </h2>
          <div className="mt-5">
            <SubmissionForm
              assignmentId={assignment.id}
              textAnswer={submission?.text_answer ?? null}
              linkUrl={submission?.link_url ?? null}
              fileName={submission?.file_name ?? null}
            />
          </div>
        </div>
      )}
    </div>
  );
}
