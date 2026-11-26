import type { Question } from "@/data/schemas";

export const questionKindLabels: Record<Question["kind"], string> = {
  "true-false": "Verdadero o falso",
  "single-choice": "Opción única",
  "multiple-choice": "Opción múltiple",
  written: "Respuesta escrita",
};

export function defaultOptionText(question: Question | undefined, index: number): string {
  if (question?.kind === "single-choice" || question?.kind === "multiple-choice") {
    return question.options[index] ?? "";
  }
  return "";
}

export function isDefaultCorrectOption(question: Question | undefined, index: number): boolean {
  if (question?.kind === "single-choice") return question.correctIndex === index;
  if (question?.kind === "multiple-choice") return question.correctIndices.includes(index);
  return false;
}

export function defaultTrueFalseAnswer(question: Question | undefined): "true" | "false" {
  return question?.kind === "true-false" && !question.correct ? "false" : "true";
}

export function defaultExpectedAnswer(question: Question | undefined): string {
  return question?.kind === "written" ? question.expectedAnswer : "";
}

export function defaultKeywordGroupsText(question: Question | undefined): string {
  if (question?.kind !== "written") return "";
  return question.keywordGroups.map((group) => group.join(", ")).join("\n");
}
