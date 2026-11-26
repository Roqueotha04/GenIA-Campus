"use client";

import { useState } from "react";
import type { Activity } from "@/data/schemas";
import { useQuizResult } from "@/hooks/useQuizResult";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import type { QuizAnswer } from "@/lib/quiz-scoring";
import { ActivityIntro } from "./ActivityIntro";
import { Quiz } from "./Quiz";
import { QuizResult } from "./QuizResult";

interface ActivityPanelProps {
  activity: Activity;
  moduleHref: string;
}

export function ActivityPanel({ activity, moduleHref }: ActivityPanelProps) {
  const profile = useCurrentProfile();
  const { answers, saveAnswers } = useQuizResult(profile.id, activity);
  const [isTaking, setIsTaking] = useState(false);

  const handleFinish = (finalAnswers: QuizAnswer[]) => {
    saveAnswers(finalAnswers);
    setIsTaking(false);
  };

  if (isTaking) {
    return <Quiz questions={activity.questions} onFinish={handleFinish} />;
  }

  if (answers) {
    return (
      <QuizResult
        activity={activity}
        answers={answers}
        moduleHref={moduleHref}
        onRetry={() => setIsTaking(true)}
      />
    );
  }

  return (
    <ActivityIntro
      title={activity.title}
      description={activity.description}
      questionCount={activity.questions.length}
      passingScore={activity.passingScore}
      onStart={() => setIsTaking(true)}
    />
  );
}
