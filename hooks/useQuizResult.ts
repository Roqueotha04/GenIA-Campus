import { useMemo } from "react";
import type { Activity } from "@/data/schemas";
import { parseAnswers, serializeAnswers, type QuizAnswer } from "@/lib/quiz-scoring";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function useQuizResult(userId: string, activity: Activity) {
  const [rawAnswers, setRawAnswers] = useLocalStorage<string>(
    `quiz-answers:${userId}:${activity.id}`,
    "",
  );

  const answers = useMemo(
    () => parseAnswers(rawAnswers, activity.questions),
    [rawAnswers, activity.questions],
  );

  const saveAnswers = (nextAnswers: QuizAnswer[]) => setRawAnswers(serializeAnswers(nextAnswers));

  return { answers, saveAnswers };
}
