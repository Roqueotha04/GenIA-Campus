import type { QuizAnswer } from "@/lib/quiz-scoring";
import { ActionButton } from "@/components/ui/Button";
import { QuizTimer } from "./QuizTimer";

interface QuizNavigatorProps {
  answers: (QuizAnswer | null)[];
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
  onFinish: () => void;
  isFinishing?: boolean;
}

function buildQuestionButtonClasses(isCurrent: boolean, isAnswered: boolean) {
  const base = "h-10 text-sm font-medium transition-colors";
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
  isFinishing = false,
}: QuizNavigatorProps) {
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const pendingCount = answers.length - answeredCount;

  return (
    <aside
      aria-label="Navegación por el cuestionario"
      className="order-first flex flex-col gap-5 border border-line bg-surface p-4 md:p-5 lg:sticky lg:top-6 lg:order-last"
    >
      <h2 className="font-heading text-base font-semibold text-foreground">
        Navegación por el cuestionario
      </h2>
      <ol className="grid grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] gap-2">
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
      <p className="text-sm text-muted">
        {answeredCount} de {answers.length} respondidas
      </p>
      <QuizTimer />
      <div>
        <ActionButton className="w-full" onClick={onFinish} disabled={pendingCount > 0 || isFinishing}>
          Terminar intento
        </ActionButton>
        {pendingCount > 0 && (
          <p className="mt-2 text-sm text-muted">
            Respondé las {pendingCount} preguntas pendientes para terminar.
          </p>
        )}
      </div>
    </aside>
  );
}
