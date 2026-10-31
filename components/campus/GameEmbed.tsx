import type { Game } from "@/data/schemas";

export function GameEmbed({ game }: { game: Game }) {
  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Juego
      </h2>
      <iframe
        src={game.path}
        title={game.title}
        sandbox="allow-scripts"
        loading="lazy"
        className="mt-6 h-[85vh] min-h-lg w-full border border-line bg-navy"
      />
    </div>
  );
}
