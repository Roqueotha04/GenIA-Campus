import type { Question } from "@/data/schemas";
import type { QuizAnswer } from "@/lib/quiz-scoring";
import { QuizAnswerInput } from "./QuizAnswerInput";

const answerHints: Record<Question["kind"], string> = {
  "true-false": "Elegí verdadero o falso:",
  "single-choice": "Seleccioná una opción:",
  "multiple-choice": "Seleccioná todas las opciones correctas:",
  written: "Escribí tu respuesta:",
};

interface QuizQuestionCardProps {
  number: number;
  question: Question;
  answer: QuizAnswer | null;
  onChange: (answer: QuizAnswer | null) => void;
}

export function QuizQuestionCard({ number, question, answer, onChange }: QuizQuestionCardProps) {
  return (
    <fieldset className="grid border border-line bg-surface md:grid-cols-[12rem_1fr]">
      <legend className="sr-only">{question.prompt}</legend>
      <div className="flex flex-col gap-3 border-b border-line p-6 text-base md:border-b-0 md:border-r md:p-8">
        <p className="text-muted">
          Pregunta{" "}
          <span className="mt-1 block font-heading text-5xl font-semibold tracking-tight text-foreground">
            {number}
          </span>
        </p>
        <p className="text-muted">{answer === null ? "Sin responder aún" : "Respondida"}</p>
        <p className="text-muted">Vale 1 punto</p>
      </div>
      <div className="bg-primary/5 p-8 md:p-12">
        <p className="font-heading text-2xl font-semibold leading-snug tracking-tight text-foreground md:text-3xl">
          {question.prompt}
        </p>
        <p className="mt-10 text-base text-muted">{answerHints[question.kind]}</p>
        <div className="mt-5">
          <QuizAnswerInput question={question} answer={answer} onChange={onChange} />
        </div>
      </div>
    </fieldset>
  );
}
