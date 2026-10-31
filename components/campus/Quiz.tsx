"use client";

import { useState } from "react";
import type { Activity } from "@/data/schemas";
import { ActionButton } from "@/components/ui/Button";
import { QuizOption } from "./QuizOption";

interface QuizProps {
  activity: Activity;
  onFinish: (answers: number[]) => void;
}

export function Quiz({ activity, onFinish }: QuizProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  const question = activity.questions[questionIndex];
  const totalQuestions = activity.questions.length;
  const isLastQuestion = questionIndex === totalQuestions - 1;
  const progressPercentage = ((questionIndex + 1) / totalQuestions) * 100;

  const handleAdvance = () => {
    if (selectedIndex === null) return;
    const nextAnswers = [...answers, selectedIndex];
    if (isLastQuestion) {
      onFinish(nextAnswers);
      return;
    }
    setAnswers(nextAnswers);
    setSelectedIndex(null);
    setQuestionIndex(questionIndex + 1);
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Actividad
        </h2>
        <p className="text-sm text-muted" aria-live="polite">
          Pregunta {questionIndex + 1} de {totalQuestions}
        </p>
      </div>
      <div
        role="progressbar"
        aria-label="Progreso de la actividad"
        aria-valuemin={0}
        aria-valuemax={totalQuestions}
        aria-valuenow={questionIndex + 1}
        className="mt-4 h-1 w-full bg-line"
      >
        <div
          className="h-full bg-primary transition-[width] duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <fieldset key={question.id} className="mt-8 border border-line bg-surface p-6 md:p-8">
        <legend className="sr-only">{question.prompt}</legend>
        <p className="font-heading text-xl font-semibold leading-snug tracking-tight text-foreground md:text-2xl">
          {question.prompt}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {question.options.map((option, optionIndex) => (
            <QuizOption
              key={option}
              name={question.id}
              label={option}
              checked={selectedIndex === optionIndex}
              onSelect={() => setSelectedIndex(optionIndex)}
            />
          ))}
        </div>
      </fieldset>
      <div className="mt-6 flex justify-end">
        <ActionButton onClick={handleAdvance} disabled={selectedIndex === null}>
          {isLastQuestion ? "Finalizar" : "Siguiente"}
        </ActionButton>
      </div>
    </div>
  );
}
