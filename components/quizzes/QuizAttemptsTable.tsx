import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatAttemptDate } from "@/lib/quizzes/format-attempt-date";
import type { StudentAttemptSummary } from "@/lib/quizzes/quiz-attempt-summaries";

interface QuizAttemptsTableProps {
  summaries: StudentAttemptSummary[];
  passingScore: number;
}

const headerClasses = "px-4 py-2.5 font-medium";

export function QuizAttemptsTable({ summaries, passingScore }: QuizAttemptsTableProps) {
  return (
    <div>
      <SectionHeading
        title="Resultados de alumnos"
        subtitle={`Nota de aprobación: ${passingScore}. El estado se calcula con la mejor nota de cada alumno.`}
      />
      {summaries.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Todavía nadie rindió este cuestionario. Los intentos aparecen acá apenas se entreguen.</p>
      ) : (
        <div className="mt-3 overflow-x-auto border border-line bg-surface">
          <table className="w-full min-w-xl text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-background text-xs text-muted">
                <th scope="col" className={headerClasses}>Alumno</th>
                <th scope="col" className={headerClasses}>Mejor nota</th>
                <th scope="col" className={headerClasses}>Último intento</th>
                <th scope="col" className={headerClasses}>Intentos</th>
                <th scope="col" className={headerClasses}>Estado</th>
                <th scope="col" className={headerClasses}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((summary) => (
                <tr key={summary.studentId} className="border-b border-line last:border-b-0">
                  <th scope="row" className="px-4 py-2.5 font-medium text-foreground">
                    {summary.studentName}
                  </th>
                  <td className="px-4 py-2.5 text-foreground">
                    {summary.bestScore}/{summary.total}
                  </td>
                  <td className="px-4 py-2.5 text-foreground">
                    {summary.lastScore}/{summary.total}
                  </td>
                  <td className="px-4 py-2.5 text-muted">{summary.attemptCount}</td>
                  <td className={`px-4 py-2.5 ${summary.passed ? "text-success" : "text-danger"}`}>
                    {summary.passed ? "Aprobado" : "No aprobado"}
                  </td>
                  <td className="px-4 py-2.5 text-muted">{formatAttemptDate(summary.lastSubmittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
