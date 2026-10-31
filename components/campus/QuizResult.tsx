import type { Activity } from "@/data/schemas";
import { scoreAnswers } from "@/lib/quiz-scoring";
import { ActionButton } from "@/components/ui/Button";
import { QuizReviewItem } from "./QuizReviewItem";

interface QuizResultProps {
  activity: Activity;
  answers: number[];
  onRetry: () => void;
}

export function QuizResult({ activity, answers, onRetry }: QuizResultProps) {
  const { score, total, passed } = scoreAnswers(activity, answers);

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Tu resultado
      </h2>
      <div className="mt-6 flex flex-col gap-6 border border-line bg-surface p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-baseline gap-3">
          <p
            className={`font-heading text-6xl font-semibold tracking-tight md:text-7xl ${
              passed ? "text-success" : "text-danger"
            }`}
          >
            {score}
            <span className="text-3xl text-muted md:text-4xl">/{total}</span>
          </p>
        </div>
        <div className="md:max-w-sm">
          <p className={`font-accent text-3xl italic ${passed ? "text-success" : "text-danger"}`}>
            {passed ? "Aprobado" : "Todavía no alcanza"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {passed
              ? `Superaste el mínimo de ${activity.passingScore} respuestas correctas.`
              : `Necesitás ${activity.passingScore} respuestas correctas para aprobar. Repasá el detalle y volvé a intentarlo.`}
          </p>
        </div>
        <ActionButton variant="outline" onClick={onRetry}>
          Volver a intentar
        </ActionButton>
      </div>
      <h3 className="mt-12 font-heading text-xl font-semibold tracking-tight text-foreground">
        Detalle de tus respuestas
      </h3>
      <ol className="mt-6 flex flex-col gap-4">
        {activity.questions.map((question, index) => (
          <QuizReviewItem
            key={question.id}
            number={index + 1}
            question={question}
            selectedIndex={answers[index]}
          />
        ))}
      </ol>
    </div>
  );
}
