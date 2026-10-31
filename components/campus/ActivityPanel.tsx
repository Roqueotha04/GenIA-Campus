"use client";

import { useState } from "react";
import type { Activity } from "@/data/schemas";
import { useQuizResult } from "@/hooks/useQuizResult";
import { useSession } from "@/hooks/useSession";
import { ActivityIntro } from "./ActivityIntro";
import { Quiz } from "./Quiz";
import { QuizResult } from "./QuizResult";

export function ActivityPanel({ activity }: { activity: Activity }) {
  const { user } = useSession();
  const { answers, saveAnswers } = useQuizResult(user?.id ?? "", activity);
  const [isTaking, setIsTaking] = useState(false);

  const handleFinish = (finalAnswers: number[]) => {
    saveAnswers(finalAnswers);
    setIsTaking(false);
  };

  if (isTaking) {
    return <Quiz activity={activity} onFinish={handleFinish} />;
  }

  if (answers) {
    return (
      <QuizResult activity={activity} answers={answers} onRetry={() => setIsTaking(true)} />
    );
  }

  return <ActivityIntro activity={activity} onStart={() => setIsTaking(true)} />;
}
