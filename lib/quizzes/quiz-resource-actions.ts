"use server";

import { errorState, successState, type FormState } from "@/lib/forms/form-state";
import { authorizeSection } from "@/lib/teacher/course-authorization";
import { parseForm, parseInput } from "@/lib/teacher/parse-form";
import { nextResourcePosition } from "@/lib/teacher/reorder";
import { createQuizResourceSchema, sectionReferenceSchema } from "./quiz-schemas";
import { revalidateQuizzes } from "./revalidate-quizzes";

export interface PublishedQuizOption {
  value: string;
  label: string;
}

export async function loadPublishedQuizOptionsAction(sectionId: string): Promise<PublishedQuizOption[]> {
  const parsed = parseInput(sectionReferenceSchema, { sectionId });
  if (!parsed.valid) return [];

  const authorization = await authorizeSection(parsed.data.sectionId);
  if (!authorization.allowed) return [];
  const { supabase, course } = authorization.context;

  const { data } = await supabase
    .from("quizzes")
    .select("id, title")
    .eq("course_id", course.id)
    .eq("is_published", true)
    .order("title");

  return (data ?? []).map((quiz) => ({ value: quiz.id, label: quiz.title }));
}

export async function createQuizResourceAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(createQuizResourceSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeSection(parsed.data.sectionId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, title")
    .eq("id", parsed.data.quizId)
    .eq("course_id", course.id)
    .eq("is_published", true)
    .maybeSingle();
  if (!quiz) return errorState("Ese cuestionario no está publicado en este curso. Publicalo y probá de nuevo.");

  const position = await nextResourcePosition(supabase, parsed.data.sectionId);
  const { error } = await supabase.from("resources").insert({
    section_id: parsed.data.sectionId,
    kind: "quiz",
    title: quiz.title,
    quiz_id: quiz.id,
    position,
  });
  if (error) return errorState("No pudimos agregar el cuestionario. Probá de nuevo en unos segundos.");

  revalidateQuizzes(course);
  return successState("Cuestionario agregado.");
}
