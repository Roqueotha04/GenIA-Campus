import type { Question } from "@/data/schemas";
import type { QuizAnswer } from "@/lib/quiz-scoring";

export interface QuizReview {
  questions: Question[];
  answers: QuizAnswer[];
  passingScore: number;
}

export type SubmitQuizAttemptResult =
  | { status: "error"; message: string }
  | { status: "saved" | "preview"; review: QuizReview };
