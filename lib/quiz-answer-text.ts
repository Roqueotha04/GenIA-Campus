import type { Question } from "@/data/schemas";
import type { QuizAnswer } from "@/lib/quiz-scoring";

const OPTION_SEPARATOR = " · ";

function describeTrueFalse(isTrue: boolean): string {
  return isTrue ? "Verdadero" : "Falso";
}

function describeSelection(options: string[], indices: number[]): string {
  return indices.map((index) => options[index]).join(OPTION_SEPARATOR);
}

export function describeAnswer(question: Question, answer: QuizAnswer): string {
  switch (question.kind) {
    case "true-false":
      return describeTrueFalse(answer === true);
    case "single-choice":
      return typeof answer === "number" ? question.options[answer] : "";
    case "multiple-choice":
      return Array.isArray(answer) ? describeSelection(question.options, answer) : "";
    case "written":
      return typeof answer === "string" ? answer : "";
  }
}

export function describeCorrectAnswer(question: Question): string {
  switch (question.kind) {
    case "true-false":
      return describeTrueFalse(question.correct);
    case "single-choice":
      return question.options[question.correctIndex];
    case "multiple-choice":
      return describeSelection(question.options, question.correctIndices);
    case "written":
      return question.expectedAnswer;
  }
}
