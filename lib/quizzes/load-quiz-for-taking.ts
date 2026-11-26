import "server-only";
import { parseAnswers } from "@/lib/quiz-scoring";
import { toPlayableQuestion, type PlayableQuestion } from "./playable-question";
import { loadLatestAttemptAnswers, loadQuizWithAnswerKey } from "./quiz-queries";
import type { QuizReview } from "./quiz-review";
import { parseStoredQuestions } from "./stored-quiz";

export interface QuizForTaking {
  title: string;
  description: string;
  passingScore: number;
  questions: PlayableQuestion[];
  initialReview: QuizReview | null;
}

interface LoadQuizForTakingInput {
  courseId: string;
  quizId: string;
  studentId: string;
  canManage: boolean;
}

export async function loadQuizForTaking({
  courseId,
  quizId,
  studentId,
  canManage,
}: LoadQuizForTakingInput): Promise<QuizForTaking | null> {
  const quiz = await loadQuizWithAnswerKey(quizId);
  if (!quiz || quiz.course_id !== courseId) return null;
  if (!quiz.is_published && !canManage) return null;

  const questions = parseStoredQuestions(quiz.questions) ?? [];
  const lastAnswers = canManage ? null : await loadLatestAttemptAnswers(quiz.id, studentId);
  const parsedAnswers = lastAnswers === null ? null : parseAnswers(JSON.stringify(lastAnswers), questions);

  return {
    title: quiz.title,
    description: quiz.description,
    passingScore: quiz.passing_score,
    questions: questions.map(toPlayableQuestion),
    initialReview: parsedAnswers
      ? { questions, answers: parsedAnswers, passingScore: quiz.passing_score }
      : null,
  };
}
