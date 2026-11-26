"use client";

import { useState, useTransition } from "react";
import { ActivityIntro } from "@/components/campus/ActivityIntro";
import { Quiz } from "@/components/campus/Quiz";
import { QuizResult } from "@/components/campus/QuizResult";
import { FormAlert } from "@/components/ui/FormAlert";
import type { QuizAnswer } from "@/lib/quiz-scoring";
import { submitQuizAttempt } from "@/lib/quizzes/attempt-actions";
import type { PlayableQuestion } from "@/lib/quizzes/playable-question";
import type { QuizReview } from "@/lib/quizzes/quiz-review";

interface QuizTakerProps {
  quizId: string;
  title: string;
  description: string;
  passingScore: number;
  questions: PlayableQuestion[];
  initialReview: QuizReview | null;
  previewNotice: string | null;
  moduleHref: string;
}

export function QuizTaker({
  quizId,
  title,
  description,
  passingScore,
  questions,
  initialReview,
  previewNotice,
  moduleHref,
}: QuizTakerProps) {
  const [review, setReview] = useState(initialReview);
  const [isTaking, setIsTaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const handleFinish = (answers: QuizAnswer[]) => {
    startTransition(async () => {
      const result = await submitQuizAttempt(quizId, answers);
      if (result.status === "error") {
        setErrorMessage(result.message);
        return;
      }
      setErrorMessage(undefined);
      setReview(result.review);
      setIsTaking(false);
    });
  };

  const handleStart = () => {
    setErrorMessage(undefined);
    setIsTaking(true);
  };

  return (
    <div className="space-y-5">
      {previewNotice && <FormAlert tone="success" message={previewNotice} />}
      {isTaking ? (
        <Quiz questions={questions} onFinish={handleFinish} isFinishing={isPending} errorMessage={errorMessage} />
      ) : review ? (
        <QuizResult
          activity={{
            id: quizId,
            title,
            description,
            passingScore: review.passingScore,
            questions: review.questions,
          }}
          answers={review.answers}
          moduleHref={moduleHref}
          onRetry={handleStart}
        />
      ) : (
        <ActivityIntro
          title={title}
          description={description}
          questionCount={questions.length}
          passingScore={passingScore}
          onStart={handleStart}
        />
      )}
    </div>
  );
}
