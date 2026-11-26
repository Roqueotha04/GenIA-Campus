import { z } from "zod";

const registeredGameSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  path: z.string().startsWith("/juegos/"),
});

export type RegisteredGame = z.infer<typeof registeredGameSchema>;

export const registeredGames = registeredGameSchema.array().parse([
  {
    slug: "las-tres-preguntas",
    title: "Las tres preguntas",
    path: "/juegos/las-tres-preguntas.html",
  },
]);

export function findRegisteredGame(slug: string): RegisteredGame | undefined {
  return registeredGames.find((game) => game.slug === slug);
}
