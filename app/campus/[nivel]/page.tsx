import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LevelView } from "@/components/campus/LevelView";
import { findLevel } from "@/lib/catalog";

interface LevelPageProps {
  params: Promise<{ nivel: string }>;
}

export async function generateMetadata({ params }: LevelPageProps): Promise<Metadata> {
  const { nivel } = await params;
  const level = findLevel(nivel);
  return { title: level?.name ?? "Nivel" };
}

export default async function LevelPage({ params }: LevelPageProps) {
  const { nivel } = await params;
  const level = findLevel(nivel);
  if (!level) notFound();

  return <LevelView level={level} />;
}
