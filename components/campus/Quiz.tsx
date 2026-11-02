"use client";

import { useState } from "react";
import type { Activity } from "@/data/schemas";
import { shuffle } from "@/lib/shuffle";
import type { QuizAnswer } from "@/lib/quiz-scoring";
import { ActionButton } from "@/components/ui/Button";
import { QuizNavigator } from "./QuizNavigator";
import { QuizQuestionCard } from "./QuizQuestionCard";

interface QuizProps {
  activity: Activity;
  onFinish: (answers: QuizAnswer[]) => void;
}

function isAnswered(answer: QuizAnswer | null): answer is QuizAnswer {
  return answer !== null;
}

export function Quiz({ activity, onFinish }: QuizProps) {
  const [questions] = useState(() => shuffle(activity.questions));
  const totalQuestions = questions.length;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(QuizAnswer | null)[]>(() =>
    questions.map(() => null),
  );

  const question = questions[questionIndex];
  const isFirstQuestion = questionIndex === 0;
  const isLastQuestion = questionIndex === totalQuestions - 1;
  const completedAnswers = answers.filter(isAnswered);
  const isComplete = completedAnswers.length === totalQuestions;

  const handleChangeAnswer = (nextAnswer: QuizAnswer | null) =>
    setAnswers((current) =>
      current.map((answer, index) => (index === questionIndex ? nextAnswer : answer)),
    );

  const handleFinish = () => {
    if (!isComplete) return;
    onFinish(activity.questions.map((original) => completedAnswers[questions.indexOf(original)]));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_21rem] lg:items-start lg:gap-12">
      <div className="flex flex-col gap-8 md:gap-10">
        <QuizQuestionCard
          number={questionIndex + 1}
          question={question}
          answer={answers[questionIndex]}
          onChange={handleChangeAnswer}
        />
        <div className="flex justify-between gap-4">
          <ActionButton
            variant="outline"
            className="min-w-36"
            onClick={() => setQuestionIndex(questionIndex - 1)}
            disabled={isFirstQuestion}
          >
            Anterior
          </ActionButton>
          {isLastQuestion ? (
            <ActionButton className="min-w-36" onClick={handleFinish} disabled={!isComplete}>
              Terminar intento
            </ActionButton>
          ) : (
            <ActionButton className="min-w-36" onClick={() => setQuestionIndex(questionIndex + 1)}>
              Siguiente
            </ActionButton>
          )}
        </div>
      </div>
      <QuizNavigator
        answers={answers}
        currentIndex={questionIndex}
        onSelectQuestion={setQuestionIndex}
        onFinish={handleFinish}
      />
    </div>
  );
}
