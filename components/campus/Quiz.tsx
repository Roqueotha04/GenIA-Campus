"use client";

import { useState } from "react";
import type { PlayableQuestion } from "@/lib/quizzes/playable-question";
import { shuffle } from "@/lib/shuffle";
import type { QuizAnswer } from "@/lib/quiz-scoring";
import { ActionButton } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/FormAlert";
import { QuizNavigator } from "./QuizNavigator";
import { QuizQuestionCard } from "./QuizQuestionCard";

interface QuizProps {
  questions: PlayableQuestion[];
  onFinish: (answers: QuizAnswer[]) => void;
  isFinishing?: boolean;
  errorMessage?: string;
}

function isAnswered(answer: QuizAnswer | null): answer is QuizAnswer {
  return answer !== null;
}

export function Quiz({ questions: originalQuestions, onFinish, isFinishing = false, errorMessage }: QuizProps) {
  const [questions] = useState(() => shuffle(originalQuestions));
  const totalQuestions = questions.length;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(QuizAnswer | null)[]>(() =>
    questions.map(() => null),
  );

  const question = questions[questionIndex];
  const isFirstQuestion = questionIndex === 0;
  const isLastQuestion = questionIndex === totalQuestions - 1;
  const completedAnswers = answers.filter(isAnswered);
  const isComplete = completedAnswers.length === totalQuestions && !isFinishing;

  const handleChangeAnswer = (nextAnswer: QuizAnswer | null) =>
    setAnswers((current) =>
      current.map((answer, index) => (index === questionIndex ? nextAnswer : answer)),
    );

  const handleFinish = () => {
    if (!isComplete) return;
    onFinish(originalQuestions.map((original) => completedAnswers[questions.indexOf(original)]));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_18rem] lg:items-start lg:gap-8">
      <div className="flex flex-col gap-5">
        <QuizQuestionCard
          number={questionIndex + 1}
          question={question}
          answer={answers[questionIndex]}
          onChange={handleChangeAnswer}
        />
        {errorMessage && <FormAlert tone="error" message={errorMessage} />}
        <div className="flex justify-between gap-4">
          <ActionButton
            variant="outline"
            className="min-w-32"
            onClick={() => setQuestionIndex(questionIndex - 1)}
            disabled={isFirstQuestion}
          >
            Anterior
          </ActionButton>
          {isLastQuestion ? (
            <ActionButton className="min-w-32" onClick={handleFinish} disabled={!isComplete}>
              {isFinishing ? "Enviando…" : "Terminar intento"}
            </ActionButton>
          ) : (
            <ActionButton className="min-w-32" onClick={() => setQuestionIndex(questionIndex + 1)}>
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
        isFinishing={isFinishing}
      />
    </div>
  );
}
