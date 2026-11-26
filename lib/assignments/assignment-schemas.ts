import { z } from "zod";
import { argentinaLocalToIso } from "./assignment-time";

const identifier = z.string().uuid("No pudimos identificar el elemento. Recargá la página.");

const requiredText = (message: string, maxLength: number) =>
  z.string().trim().min(1, message).max(maxLength, `Usá como máximo ${maxLength} caracteres.`);

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `Usá como máximo ${maxLength} caracteres.`)
    .transform((value) => (value === "" ? null : value));

const uploadedFileSchema = z.object({
  path: z.string().min(1, "Falta la ubicación del archivo subido."),
  name: z.string().min(1, "Falta el nombre del archivo.").max(255, "El nombre del archivo es demasiado largo."),
});

const optionalMomentSchema = (invalidMessage: string) =>
  z.string().transform((value, context) => {
    if (value.trim() === "") return null;
    const isoDate = argentinaLocalToIso(value.trim());
    if (!isoDate) {
      context.addIssue({ code: "custom", message: invalidMessage });
      return z.NEVER;
    }
    return isoDate;
  });

interface AssignmentDeadlines {
  dueAt: string | null;
  cutoffAt: string | null;
}

function cutoffIsNotBeforeDue({ dueAt, cutoffAt }: AssignmentDeadlines): boolean {
  if (!dueAt || !cutoffAt) return true;
  return new Date(cutoffAt).getTime() >= new Date(dueAt).getTime();
}

const CUTOFF_BEFORE_DUE = {
  message: "La fecha límite real tiene que ser igual o posterior a la fecha de entrega.",
  path: ["cutoffAt"],
};

const httpUrl = z
  .string()
  .trim()
  .refine((value) => {
    if (value === "") return true;
    try {
      const { protocol } = new URL(value);
      return protocol === "http:" || protocol === "https:";
    } catch {
      return false;
    }
  }, "El enlace tiene que ser una dirección completa que empiece con http:// o https://.")
  .transform((value) => (value === "" ? null : value));

const assignmentFields = {
  title: requiredText("Escribí un nombre para la tarea.", 160),
  instructions: z.string().trim().max(5000, "Usá como máximo 5000 caracteres."),
  dueAt: optionalMomentSchema("La fecha de entrega no es válida. Elegila de nuevo."),
  cutoffAt: optionalMomentSchema("La fecha límite real no es válida. Elegila de nuevo."),
  maxGrade: z
    .number("Ingresá la nota máxima.")
    .positive("La nota máxima tiene que ser mayor a 0.")
    .max(999, "La nota máxima no puede superar 999."),
};

export const createAssignmentSchema = z
  .object({
    sectionId: identifier,
    ...assignmentFields,
    attachment: uploadedFileSchema.nullable(),
  })
  .refine(cutoffIsNotBeforeDue, CUTOFF_BEFORE_DUE);

export const updateAssignmentSchema = z
  .object({
    assignmentId: identifier,
    ...assignmentFields,
    attachment: uploadedFileSchema.nullable(),
    removeAttachment: z.boolean(),
  })
  .refine(cutoffIsNotBeforeDue, CUTOFF_BEFORE_DUE);

export const submitAssignmentSchema = z.object({
  assignmentId: identifier,
  textAnswer: optionalText(10000),
  linkUrl: httpUrl,
  file: uploadedFileSchema.nullable(),
});

export const gradeSubmissionSchema = z.object({
  submissionId: identifier,
  grade: z.number("Ingresá la nota.").min(0, "La nota no puede ser negativa."),
  feedback: optionalText(3000),
});

export type CreateAssignmentInput = z.input<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.input<typeof updateAssignmentSchema>;
export type SubmitAssignmentInput = z.input<typeof submitAssignmentSchema>;
export type GradeSubmissionInput = z.input<typeof gradeSubmissionSchema>;
