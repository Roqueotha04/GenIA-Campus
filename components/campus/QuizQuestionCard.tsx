import type { PlayableQuestion } from "@/lib/quizzes/playable-question";
import type { QuizAnswer } from "@/lib/quiz-scoring";
import { QuizAnswerInput } from "./QuizAnswerInput";

const answerHints: Record<PlayableQuestion["kind"], string> = {
  "true-false": "Elegí verdadero o falso:",
  "single-choice": "Seleccioná una opción:",
  "multiple-choice": "Seleccioná todas las opciones correctas:",
  written: "Escribí tu respuesta:",
};

interface QuizQuestionCardProps {
  number: number;
  question: PlayableQuestion;
  answer: QuizAnswer | null;
  onChange: (answer: QuizAnswer | null) => void;
}

export function QuizQuestionCard({ number, question, answer, onChange }: QuizQuestionCardProps) {
  return (
    <fieldset className="grid border border-line bg-surface md:grid-cols-[9rem_1fr]">
      <legend className="sr-only">{question.prompt}</legend>
      <div className="flex flex-col gap-2 border-b border-line p-4 text-sm md:border-b-0 md:border-r md:p-5">
        <p className="text-muted">
          Pregunta{" "}
          <span className="mt-1 block font-heading text-3xl font-semibold text-foreground">
            {number}
          </span>
        </p>
        <p className="text-muted">{answer === null ? "Sin responder aún" : "Respondida"}</p>
        <p className="text-muted">Vale 1 punto</p>
      </div>
      <div className="bg-primary/5 p-5 md:p-6">
        <p className="font-heading text-lg font-semibold leading-snug text-foreground md:text-xl">
          {question.prompt}
        </p>
        <p className="mt-5 text-sm text-muted">{answerHints[question.kind]}</p>
        <div className="mt-3">
          <QuizAnswerInput question={question} answer={answer} onChange={onChange} />
        </div>
      </div>
    </fieldset>
  );
}
