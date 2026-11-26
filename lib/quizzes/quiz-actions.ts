"use server";

import { redirect } from "next/navigation";
import { errorState, successState, type FormState } from "@/lib/forms/form-state";
import { authorizeCourse } from "@/lib/teacher/course-authorization";
import { parseForm } from "@/lib/teacher/parse-form";
import { swapWithNeighbor } from "@/lib/teacher/reorder";
import { authorizeQuiz } from "./quiz-authorization";
import { parseQuestionForm } from "./question-form";
import {
  createQuizSchema,
  moveQuestionSchema,
  questionReferenceSchema,
  quizIdSchema,
  saveQuestionSchema,
  setQuizPublishedSchema,
  updateQuizSchema,
} from "./quiz-schemas";
import { buildQuizEditorHref } from "./quiz-routes";
import { revalidateQuizzes } from "./revalidate-quizzes";
import { saveQuestions } from "./save-questions";
import { parseStoredQuestions } from "./stored-quiz";

const SAVE_FAILED = "No pudimos guardar los cambios. Probá de nuevo en unos segundos.";
const CORRUPTED_QUESTIONS = "Las preguntas guardadas tienen un formato inesperado. Pedile ayuda a un administrador.";
const QUESTION_NOT_FOUND = "No encontramos esa pregunta. Recargá la página y probá de nuevo.";

export async function createQuizAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(createQuizSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeCourse(parsed.data.courseId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const { data: quiz, error } = await supabase
    .from("quizzes")
    .insert({ course_id: course.id, title: parsed.data.title })
    .select("id")
    .single();
  if (error || !quiz) return errorState("No pudimos crear el cuestionario. Probá de nuevo en unos segundos.");

  revalidateQuizzes(course);
  redirect(buildQuizEditorHref(course, quiz.id));
}

export async function updateQuizAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(updateQuizSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeQuiz(parsed.data.quizId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course, quiz } = authorization.context;

  const questions = parseStoredQuestions(quiz.questions);
  if (!questions) return errorState(CORRUPTED_QUESTIONS);
  if (questions.length > 0 && parsed.data.passingScore > questions.length) {
    return errorState(`La nota de aprobación no puede superar la cantidad de preguntas (${questions.length}).`);
  }

  const { error } = await supabase
    .from("quizzes")
    .update({
      title: parsed.data.title,
      description: parsed.data.description,
      passing_score: parsed.data.passingScore,
    })
    .eq("id", quiz.id);
  if (error) return errorState(SAVE_FAILED);

  revalidateQuizzes(course);
  return successState("Cambios guardados.");
}

export async function setQuizPublishedAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(setQuizPublishedSchema, formData);
  if (!parsed.valid) return parsed.state;
  const shouldPublish = parsed.data.publish === "true";

  const authorization = await authorizeQuiz(parsed.data.quizId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course, quiz } = authorization.context;

  const questions = parseStoredQuestions(quiz.questions);
  if (!questions) return errorState(CORRUPTED_QUESTIONS);
  if (shouldPublish && questions.length === 0) {
    return errorState("Agregá al menos una pregunta antes de publicar el cuestionario.");
  }

  const { error } = await supabase.from("quizzes").update({ is_published: shouldPublish }).eq("id", quiz.id);
  if (error) return errorState(SAVE_FAILED);

  revalidateQuizzes(course);
  return successState(shouldPublish ? "Cuestionario publicado." : "Cuestionario despublicado.");
}

export async function deleteQuizAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(quizIdSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeQuiz(parsed.data.quizId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course, quiz } = authorization.context;

  const { error } = await supabase.from("quizzes").delete().eq("id", quiz.id);
  if (error) return errorState("No pudimos eliminar el cuestionario. Probá de nuevo en unos segundos.");

  revalidateQuizzes(course);
  return successState("Cuestionario eliminado.");
}

export async function saveQuestionAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(saveQuestionSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeQuiz(parsed.data.quizId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course, quiz } = authorization.context;

  const questions = parseStoredQuestions(quiz.questions);
  if (!questions) return errorState(CORRUPTED_QUESTIONS);

  const isNewQuestion = parsed.data.questionId === "";
  const questionId = isNewQuestion ? crypto.randomUUID() : parsed.data.questionId;
  if (!isNewQuestion && !questions.some((question) => question.id === questionId)) {
    return errorState(QUESTION_NOT_FOUND);
  }

  const parsedQuestion = parseQuestionForm(formData, questionId);
  if (!parsedQuestion.valid) return errorState(parsedQuestion.message);

  const nextQuestions = isNewQuestion
    ? [...questions, parsedQuestion.question]
    : questions.map((question) => (question.id === questionId ? parsedQuestion.question : question));

  const saved = await saveQuestions(supabase, quiz, nextQuestions);
  if (!saved) return errorState("No pudimos guardar la pregunta. Probá de nuevo en unos segundos.");

  revalidateQuizzes(course);
  return successState(isNewQuestion ? "Pregunta agregada." : "Pregunta actualizada.");
}

export async function deleteQuestionAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(questionReferenceSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeQuiz(parsed.data.quizId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course, quiz } = authorization.context;

  const questions = parseStoredQuestions(quiz.questions);
  if (!questions) return errorState(CORRUPTED_QUESTIONS);

  const remaining = questions.filter((question) => question.id !== parsed.data.questionId);
  if (remaining.length === questions.length) return errorState(QUESTION_NOT_FOUND);

  const saved = await saveQuestions(supabase, quiz, remaining);
  if (!saved) return errorState("No pudimos eliminar la pregunta. Probá de nuevo en unos segundos.");

  revalidateQuizzes(course);
  return successState("Pregunta eliminada.");
}

export async function moveQuestionAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(moveQuestionSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeQuiz(parsed.data.quizId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course, quiz } = authorization.context;

  const questions = parseStoredQuestions(quiz.questions);
  if (!questions) return errorState(CORRUPTED_QUESTIONS);

  const reordered = swapWithNeighbor(questions, parsed.data.questionId, parsed.data.direction);
  if (!reordered) return errorState("La pregunta ya está en ese extremo de la lista.");

  const saved = await saveQuestions(supabase, quiz, reordered);
  if (!saved) return errorState("No pudimos reordenar las preguntas. Recargá la página y probá de nuevo.");

  revalidateQuizzes(course);
  return successState("Orden actualizado.");
}
