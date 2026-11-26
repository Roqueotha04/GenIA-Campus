import { z } from "zod";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/roles";

const idField = z.uuid("No pudimos identificar el registro. Recargá la página e intentá de nuevo.");

const fullNameField = z.string().trim().min(1, "Escribí el nombre completo.");

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Escribí un email válido, por ejemplo nombre@dominio.com."));

const passwordField = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `La contraseña tiene que tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);

const roleField = z.enum(["admin", "docente", "alumno"], "Elegí un rol de la lista.");

const checkboxField = z
  .string()
  .optional()
  .transform((value) => value === "on");

export const roleFilterSchema = roleField.nullable().catch(null);

export const createUserSchema = z.object({
  fullName: fullNameField,
  email: emailField,
  password: passwordField,
  role: roleField,
});

export const updateUserSchema = z.object({
  id: idField,
  fullName: fullNameField,
  role: roleField,
});

export const resetPasswordSchema = z.object({
  id: idField,
  password: passwordField,
});

export const setUserActiveSchema = z.object({
  id: idField,
  active: z.enum(["true", "false"]).transform((value) => value === "true"),
});

export const userIdSchema = z.object({ id: idField });

export const createCourseSchema = z.object({
  moduleKey: z.string().min(1, "Elegí el nivel y el módulo del curso."),
  title: z.string().trim(),
  description: z.string().trim(),
  isPublished: checkboxField,
});

export const updateCourseSchema = z.object({
  id: idField,
  title: z.string().trim().min(1, "Escribí un título para el curso."),
  description: z.string().trim(),
  isPublished: checkboxField,
});

export const courseIdSchema = z.object({ id: idField });

export const courseTeacherSchema = z.object({
  courseId: idField,
  teacherId: z.uuid("Elegí un docente de la lista."),
});

export const courseStudentSchema = z.object({
  courseId: idField,
  studentId: z.uuid("Elegí un alumno de la lista."),
});
