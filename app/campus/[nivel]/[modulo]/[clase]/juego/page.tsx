import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameView } from "@/components/campus/GameView";
import { findClassContext } from "@/lib/catalog";

interface GamePageProps {
  params: Promise<{ nivel: string; modulo: string; clase: string }>;
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { nivel, modulo, clase } = await params;
  const game = findClassContext(nivel, modulo, clase)?.courseClass.game;
  return { title: game?.title ?? "Juego" };
}

export default async function GamePage({ params }: GamePageProps) {
  const { nivel, modulo, clase } = await params;
  const classContext = findClassContext(nivel, modulo, clase);
  const game = classContext?.courseClass.game;
  if (!classContext || !game) notFound();

  return <GameView {...classContext} game={game} />;
}
