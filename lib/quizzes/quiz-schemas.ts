import { z } from "zod";

const identifier = z.string().uuid("No pudimos identificar el elemento. Recargá la página.");

const optionalIdentifier = z.union([z.literal(""), identifier]).default("");

const moveDirection = z.enum(["up", "down"], "Elegí una dirección válida.");

export const createQuizSchema = z.object({
  courseId: identifier,
  title: z.string().trim().min(1, "Escribí un título para el cuestionario.").max(160, "Usá como máximo 160 caracteres."),
});

export const updateQuizSchema = z.object({
  quizId: identifier,
  title: createQuizSchema.shape.title,
  description: z.string().trim().max(1000, "Usá como máximo 1000 caracteres en la descripción.").default(""),
  passingScore: z.coerce
    .number("Escribí la nota de aprobación como un número.")
    .int("La nota de aprobación tiene que ser un número entero.")
    .min(1, "La nota de aprobación tiene que ser al menos 1."),
});

export const quizIdSchema = z.object({ quizId: identifier });

export const setQuizPublishedSchema = z.object({
  quizId: identifier,
  publish: z.enum(["true", "false"]),
});

export const saveQuestionSchema = z.object({ quizId: identifier, questionId: optionalIdentifier });

export const questionReferenceSchema = z.object({ quizId: identifier, questionId: identifier });

export const moveQuestionSchema = questionReferenceSchema.extend({ direction: moveDirection });

export const createQuizResourceSchema = z.object({ sectionId: identifier, quizId: identifier });

export const sectionReferenceSchema = z.object({ sectionId: identifier });
