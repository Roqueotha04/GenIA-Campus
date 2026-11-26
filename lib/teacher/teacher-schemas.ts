import { z } from "zod";
import { registeredGames } from "@/data/games";

const requiredText = (message: string, maxLength: number) =>
  z.string().trim().min(1, message).max(maxLength, `Usá como máximo ${maxLength} caracteres.`);

const identifier = z.string().uuid("No pudimos identificar el elemento. Recargá la página.");

const moveDirectionSchema = z.enum(["up", "down"], "Elegí una dirección válida.");

const httpUrl = z
  .string()
  .trim()
  .min(1, "Pegá la dirección del enlace.")
  .refine((value) => {
    try {
      const { protocol } = new URL(value);
      return protocol === "http:" || protocol === "https:";
    } catch {
      return false;
    }
  }, "El enlace tiene que ser una dirección completa que empiece con http:// o https://.");

export const courseIdSchema = z.object({ courseId: identifier });

export const createSectionSchema = z.object({
  courseId: identifier,
  title: requiredText("Escribí un título para la sección.", 120),
  description: z.string().trim().max(500, "Usá como máximo 500 caracteres.").default(""),
});

export const updateSectionSchema = createSectionSchema.omit({ courseId: true }).extend({ sectionId: identifier });

export const sectionIdSchema = z.object({ sectionId: identifier });

export const moveSectionSchema = z.object({ sectionId: identifier, direction: moveDirectionSchema });

export const resourceIdSchema = z.object({ resourceId: identifier });

export const moveResourceSchema = z.object({ resourceId: identifier, direction: moveDirectionSchema });

export const renameResourceSchema = z.object({
  resourceId: identifier,
  title: requiredText("Escribí un título para el recurso.", 160),
});

export const createLinkResourceSchema = z.object({
  sectionId: identifier,
  title: requiredText("Escribí un título para el enlace.", 160),
  url: httpUrl,
});

export const createGameResourceSchema = z.object({
  sectionId: identifier,
  gameSlug: z
    .string()
    .refine((slug) => registeredGames.some((game) => game.slug === slug), "Elegí un juego de la lista."),
});

export const registerMaterialSchema = z.object({
  sectionId: identifier,
  title: requiredText("Escribí un título para el archivo.", 160),
  storagePath: z.string().min(1, "Falta la ubicación del archivo subido."),
  mimeType: z.string().max(200).default(""),
  sizeBytes: z.number().int().positive("El archivo está vacío."),
});

export const createNoticeSchema = z.object({
  courseId: identifier,
  title: requiredText("Escribí un título para el aviso.", 160),
  body: requiredText("Escribí el mensaje del aviso.", 2000),
});

export const noticeIdSchema = z.object({ noticeId: identifier });
