import type { Question } from "@/data/schemas";

export type PlayableQuestion =
  | { id: string; prompt: string; kind: "true-false" | "written" }
  | { id: string; prompt: string; kind: "single-choice" | "multiple-choice"; options: string[] };

export function toPlayableQuestion(question: Question): PlayableQuestion {
  switch (question.kind) {
    case "true-false":
    case "written":
      return { id: question.id, prompt: question.prompt, kind: question.kind };
    case "single-choice":
    case "multiple-choice":
      return { id: question.id, prompt: question.prompt, kind: question.kind, options: question.options };
  }
}
