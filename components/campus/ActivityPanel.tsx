"use client";

import { useState } from "react";
import type { Activity } from "@/data/schemas";
import { useQuizResult } from "@/hooks/useQuizResult";
import { useSession } from "@/hooks/useSession";
import type { QuizAnswer } from "@/lib/quiz-scoring";
import { ActivityIntro } from "./ActivityIntro";
import { Quiz } from "./Quiz";
import { QuizResult } from "./QuizResult";

interface ActivityPanelProps {
  activity: Activity;
  moduleHref: string;
}

export function ActivityPanel({ activity, moduleHref }: ActivityPanelProps) {
  const { user } = useSession();
  const { answers, saveAnswers } = useQuizResult(user?.id ?? "", activity);
  const [isTaking, setIsTaking] = useState(false);

  const handleFinish = (finalAnswers: QuizAnswer[]) => {
    saveAnswers(finalAnswers);
    setIsTaking(false);
  };

  if (isTaking) {
    return <Quiz activity={activity} onFinish={handleFinish} />;
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

  return <ActivityIntro activity={activity} onStart={() => setIsTaking(true)} />;
}
