import type { Question } from "@/data/schemas";
import { describeAnswer, describeCorrectAnswer } from "@/lib/quiz-answer-text";
import { isAnswerCorrect, type QuizAnswer } from "@/lib/quiz-scoring";
import { CheckIcon, CloseIcon } from "@/components/ui/icons";

interface QuizReviewItemProps {
  number: number;
  question: Question;
  answer: QuizAnswer;
}

export function QuizReviewItem({ number, question, answer }: QuizReviewItemProps) {
  const isCorrect = isAnswerCorrect(question, answer);
  const correctAnswerLabel = question.kind === "written" ? "Respuesta esperada" : "Respuesta correcta";

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
          <p className="mt-3 whitespace-pre-line text-sm text-muted">
            Tu respuesta: <span className="text-foreground">{describeAnswer(question, answer)}</span>
          </p>
          {!isCorrect && (
            <p className="mt-1 text-sm text-muted">
              {correctAnswerLabel}:{" "}
              <span className="text-foreground">{describeCorrectAnswer(question)}</span>
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
