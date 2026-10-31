import type { Question } from "@/data/schemas";
import { CheckIcon, CloseIcon } from "@/components/ui/icons";

interface QuizReviewItemProps {
  number: number;
  question: Question;
  selectedIndex: number;
}

export function QuizReviewItem({ number, question, selectedIndex }: QuizReviewItemProps) {
  const isCorrect = selectedIndex === question.correctIndex;

  return (
    <li className="border border-line bg-surface p-5 md:p-6">
      <div className="flex items-start gap-4">
        <span
          className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${
            isCorrect ? "bg-success" : "bg-danger"
          }`}
        >
          {isCorrect ? <CheckIcon className="h-4 w-4" /> : <CloseIcon className="h-4 w-4" />}
          <span className="sr-only">{isCorrect ? "Correcta" : "Incorrecta"}</span>
        </span>
        <div>
          <p className="font-medium text-foreground">
            {number}. {question.prompt}
          </p>
          <p className="mt-3 text-sm text-muted">
            Tu respuesta: <span className="text-foreground">{question.options[selectedIndex]}</span>
          </p>
          {!isCorrect && (
            <p className="mt-1 text-sm text-muted">
              Respuesta correcta:{" "}
              <span className="text-foreground">{question.options[question.correctIndex]}</span>
            </p>
          )}
          <p className="mt-3 border-l-2 border-primary pl-3 text-sm leading-relaxed text-muted">
            {question.explanation}
          </p>
        </div>
      </div>
    </li>
  );
}
