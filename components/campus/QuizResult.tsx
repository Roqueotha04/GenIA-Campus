"use client";

import { useState } from "react";
import type { Activity } from "@/data/schemas";
import { scoreAnswers, type QuizAnswer } from "@/lib/quiz-scoring";
import { ActionButton, Button } from "@/components/ui/Button";
import { QuizReviewItem } from "./QuizReviewItem";

interface QuizResultProps {
  activity: Activity;
  answers: QuizAnswer[];
  moduleHref: string;
  onRetry: () => void;
}

export function QuizResult({ activity, answers, moduleHref, onRetry }: QuizResultProps) {
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const { score, total, passed } = scoreAnswers(activity, answers);
  const toneClass = passed ? "text-success" : "text-danger";

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold text-foreground">
        Tu resultado
      </h2>
      <div className="mt-3 flex flex-col gap-6 border border-line bg-surface p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <p
            className={`font-heading text-5xl font-semibold tracking-tight md:text-6xl ${toneClass}`}
          >
            {score}
            <span className="text-2xl text-muted md:text-3xl">/{total}</span>
          </p>
          <div className="md:max-w-md">
            <p className={`font-heading text-xl font-semibold ${toneClass}`}>
              {passed ? "Aprobado" : "Todavía no alcanza"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {passed
                ? `Superaste el mínimo de ${activity.passingScore} respuestas correctas.`
                : `Necesitás ${activity.passingScore} respuestas correctas para aprobar. Repasá el detalle y volvé a intentarlo.`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 border-t border-line pt-5">
          <ActionButton onClick={onRetry}>Volver a intentar</ActionButton>
          <ActionButton variant="outline" onClick={() => setIsDetailVisible(!isDetailVisible)}>
            {isDetailVisible ? "Ocultar respuestas" : "Ver respuestas"}
          </ActionButton>
          <Button href={moduleHref} variant="outline">
            Volver al módulo
          </Button>
        </div>
      </div>
      {isDetailVisible && (
        <div className="mt-8">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            Detalle de tus respuestas
          </h3>
          <ol className="mt-3 flex flex-col gap-3">
            {activity.questions.map((question, index) => (
              <QuizReviewItem
                key={question.id}
                number={index + 1}
                question={question}
                answer={answers[index]}
              />
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
