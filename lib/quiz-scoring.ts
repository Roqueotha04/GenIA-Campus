import type { Activity } from "@/data/schemas";

export interface QuizScore {
  score: number;
  total: number;
  passed: boolean;
}

export function scoreAnswers(activity: Activity, answers: number[]): QuizScore {
  const score = activity.questions.filter(
    (question, index) => answers[index] === question.correctIndex,
  ).length;
  return {
    score,
    total: activity.questions.length,
    passed: score >= activity.passingScore,
  };
}

export function serializeAnswers(answers: number[]): string {
  return answers.join(",");
}

export function parseAnswers(raw: string, expectedLength: number): number[] | null {
  if (!raw) return null;
  const answers = raw.split(",").map(Number);
  const isValid =
    answers.length === expectedLength && answers.every((answer) => Number.isInteger(answer));
  return isValid ? answers : null;
}
