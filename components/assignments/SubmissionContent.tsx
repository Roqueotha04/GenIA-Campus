import { formatMoment } from "@/lib/assignments/assignment-time";
import { isSubmittedLate } from "@/lib/assignments/assignment-window";
import type { SubmissionView } from "@/lib/assignments/assignment-queries";

interface SubmissionContentProps {
  submission: SubmissionView;
  dueAt: string | null;
}

export function SubmissionContent({ submission, dueAt }: SubmissionContentProps) {
  const isLate = isSubmittedLate(submission.submitted_at, dueAt);

  return (
    <div className="space-y-3 text-sm">
      <p className="text-muted">
        Entregado el {formatMoment(submission.submitted_at)}
        {isLate && <span className="ml-2 font-medium text-danger">Fuera de término</span>}
      </p>
      {submission.text_answer && (
        <p className="whitespace-pre-wrap break-words text-foreground">{submission.text_answer}</p>
      )}
      {submission.link_url && (
        <p>
          <a
            href={submission.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-primary underline underline-offset-4"
          >
            {submission.link_url}
          </a>
        </p>
      )}
      {submission.file_path && (
        <p>
          {submission.fileUrl ? (
            <a href={submission.fileUrl} className="break-all text-primary underline underline-offset-4">
              {submission.file_name ?? "Archivo entregado"}
            </a>
          ) : (
            <span className="text-muted">No pudimos generar el enlace del archivo. Recargá la página.</span>
          )}
        </p>
      )}
    </div>
  );
}
