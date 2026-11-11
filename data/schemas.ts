import { z } from "zod";

export const userSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(1),
  role: z.enum(["alumno", "docente"]),
});

const baseQuestionShape = {
  id: z.string().min(1),
  prompt: z.string().min(1),
  explanation: z.string().min(1),
};

export const trueFalseQuestionSchema = z.object({
  ...baseQuestionShape,
  kind: z.literal("true-false"),
  correct: z.boolean(),
});

export const singleChoiceQuestionSchema = z.object({
  ...baseQuestionShape,
  kind: z.literal("single-choice"),
  options: z.array(z.string().min(1)).length(4),
  correctIndex: z.number().int().min(0).max(3),
});

export const multipleChoiceQuestionSchema = z.object({
  ...baseQuestionShape,
  kind: z.literal("multiple-choice"),
  options: z.array(z.string().min(1)).min(4).max(6),
  correctIndices: z.array(z.number().int().min(0).max(5)).min(2),
});

export const writtenQuestionSchema = z.object({
  ...baseQuestionShape,
  kind: z.literal("written"),
  expectedAnswer: z.string().min(1),
  keywordGroups: z.array(z.array(z.string().min(1)).min(1)).min(1),
});

export const questionSchema = z.discriminatedUnion("kind", [
  trueFalseQuestionSchema,
  singleChoiceQuestionSchema,
  multipleChoiceQuestionSchema,
  writtenQuestionSchema,
]);

export const activitySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  passingScore: z.number().int().min(1),
  questions: z.array(questionSchema).min(1),
});

export const downloadSchema = z.object({
  label: z.string().min(1),
  path: z.string().startsWith("/"),
});

export const gameSchema = z.object({
  title: z.string().min(1),
  path: z.string().startsWith("/"),
});

export const courseClassSchema = z.object({
  number: z.number().int().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  presentationPdf: z.string().startsWith("/").optional(),
  summaryDocument: downloadSchema.optional(),
  assignments: z.array(downloadSchema).optional(),
  activity: activitySchema.optional(),
  game: gameSchema.optional(),
});

export const noticeSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  message: z.string().min(1),
  date: z.string().min(1),
});

export const courseModuleSchema = z.object({
  number: z.number().int().min(1),
  generalDocuments: z.array(downloadSchema).optional(),
  presentations: z.array(downloadSchema).optional(),
  notices: z.array(noticeSchema).optional(),
  classes: z.array(courseClassSchema).optional(),
});

export const levelAccentSchema = z.enum(["level-1", "level-2", "level-3", "level-4"]);

export const levelSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  accent: levelAccentSchema,
  modules: z.array(courseModuleSchema).min(1),
});

export const sampleResultSchema = z.object({
  studentName: z.string().min(1),
  score: z.number().int().min(0),
  total: z.number().int().min(1),
  date: z.string().min(1),
});

export type User = z.infer<typeof userSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Notice = z.infer<typeof noticeSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type Download = z.infer<typeof downloadSchema>;
export type Game = z.infer<typeof gameSchema>;
export type CourseClass = z.infer<typeof courseClassSchema>;
export type CourseModule = z.infer<typeof courseModuleSchema>;
export type LevelAccent = z.infer<typeof levelAccentSchema>;
export type Level = z.infer<typeof levelSchema>;
export type SampleResult = z.infer<typeof sampleResultSchema>;
