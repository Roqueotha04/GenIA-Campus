import type { QuizAnswer } from "@/lib/quiz-scoring";
import { ActionButton } from "@/components/ui/Button";
import { QuizTimer } from "./QuizTimer";

interface QuizNavigatorProps {
  answers: (QuizAnswer | null)[];
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
  onFinish: () => void;
}

function buildQuestionButtonClasses(isCurrent: boolean, isAnswered: boolean) {
  const base = "h-12 text-base font-medium transition-colors";
  const fill = isAnswered
    ? "bg-navy text-white"
    : "bg-surface text-foreground hover:bg-navy/5";
  const border = isCurrent ? "border-2 border-primary" : "border border-line";
  return `${base} ${fill} ${border}`;
}

export function QuizNavigator({
  answers,
  currentIndex,
  onSelectQuestion,
  onFinish,
}: QuizNavigatorProps) {
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const pendingCount = answers.length - answeredCount;

  return (
    <aside
      aria-label="Navegación por el cuestionario"
      className="order-first flex flex-col gap-8 border border-line bg-surface p-6 md:p-8 lg:sticky lg:top-6 lg:order-last"
    >
      <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
        Navegación por el cuestionario
      </h2>
      <ol className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-3">
        {answers.map((answer, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => onSelectQuestion(index)}
              aria-current={index === currentIndex ? "step" : undefined}
              aria-label={`Pregunta ${index + 1}${answer !== null ? ", respondida" : ""}`}
              className={`w-full ${buildQuestionButtonClasses(index === currentIndex, answer !== null)}`}
            >
              {index + 1}
            </button>
          </li>
        ))}
      </ol>
      <p className="text-base text-muted">
        {answeredCount} de {answers.length} respondidas
      </p>
      <QuizTimer />
      <div>
        <ActionButton className="w-full" onClick={onFinish} disabled={pendingCount > 0}>
          Terminar intento
        </ActionButton>
        {pendingCount > 0 && (
          <p className="mt-4 text-sm text-muted">
            Respondé las {pendingCount} preguntas pendientes para terminar.
          </p>
        )}
      </div>
    </aside>
  );
}
