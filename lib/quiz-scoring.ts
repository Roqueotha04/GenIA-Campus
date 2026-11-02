import type { Activity, Question } from "@/data/schemas";

export type QuizAnswer = boolean | number | number[] | string;

export interface QuizScore {
  score: number;
  total: number;
  passed: boolean;
}

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function containsKeyword(normalizedText: string, keyword: string): boolean {
  const normalizedKeyword = normalizeText(keyword);
  if (normalizedKeyword.includes(" ")) return normalizedText.includes(normalizedKeyword);
  return normalizedText
    .split(/[^a-z0-9]+/)
    .some((word) => word.startsWith(normalizedKeyword));
}

function isSameSelection(selected: number[], correct: number[]): boolean {
  return selected.length === correct.length && correct.every((index) => selected.includes(index));
}

export function isAnswerCorrect(question: Question, answer: QuizAnswer): boolean {
  switch (question.kind) {
    case "true-false":
      return answer === question.correct;
    case "single-choice":
      return answer === question.correctIndex;
    case "multiple-choice":
      return Array.isArray(answer) && isSameSelection(answer, question.correctIndices);
    case "written": {
      if (typeof answer !== "string") return false;
      const normalizedAnswer = normalizeText(answer);
      return question.keywordGroups.every((group) =>
        group.some((keyword) => containsKeyword(normalizedAnswer, keyword)),
      );
    }
  }
}

export function scoreAnswers(activity: Activity, answers: QuizAnswer[]): QuizScore {
  const score = activity.questions.filter((question, index) =>
    isAnswerCorrect(question, answers[index]),
  ).length;
  return {
    score,
    total: activity.questions.length,
    passed: score >= activity.passingScore,
  };
}

function hasValidShape(question: Question, answer: unknown): answer is QuizAnswer {
  switch (question.kind) {
    case "true-false":
      return typeof answer === "boolean";
    case "single-choice":
      return Number.isInteger(answer);
    case "multiple-choice":
      return Array.isArray(answer) && answer.every((index) => Number.isInteger(index));
    case "written":
      return typeof answer === "string";
  }
}

export function serializeAnswers(answers: QuizAnswer[]): string {
  return JSON.stringify(answers);
}

export function parseAnswers(raw: string, questions: Question[]): QuizAnswer[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== questions.length) return null;
    const isValid = questions.every((question, index) => hasValidShape(question, parsed[index]));
    return isValid ? parsed : null;
  } catch {
    return null;
  }
}
