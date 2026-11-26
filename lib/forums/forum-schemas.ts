import { z } from "zod";

const identifier = z.string().uuid("No pudimos identificar el elemento. Recargá la página.");

const requiredText = (message: string, maxLength: number) =>
  z.string().trim().min(1, message).max(maxLength, `Usá como máximo ${maxLength} caracteres.`);

const forumIntro = z.string().trim().max(2000, "Usá como máximo 2000 caracteres.").default("");

const forumTitle = requiredText("Escribí un nombre para el foro.", 160);

const postBody = (message: string) => requiredText(message, 5000);

export const createForumSchema = z.object({
  sectionId: identifier,
  title: forumTitle,
  intro: forumIntro,
});

export const updateForumSchema = z.object({
  forumId: identifier,
  title: forumTitle,
  intro: forumIntro,
});

export const createTopicSchema = z.object({
  forumId: identifier,
  title: requiredText("Escribí un título para el tema.", 160),
  body: postBody("Escribí el mensaje del tema."),
});

export const replyToTopicSchema = z.object({
  topicId: identifier,
  body: postBody("Escribí tu respuesta."),
});

export const topicIdSchema = z.object({ topicId: identifier });

export const postIdSchema = z.object({ postId: identifier });
