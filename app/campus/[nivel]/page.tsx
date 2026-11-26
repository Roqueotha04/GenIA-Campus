import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LevelView } from "@/components/campus/LevelView";
import { requireProfile } from "@/lib/auth/current-profile";
import { findLevel } from "@/lib/catalog";
import { getModuleAvailability } from "@/lib/course-content/my-courses-queries";

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

  const profile = await requireProfile();
  const availability = await getModuleAvailability(level.slug, profile);

  return <LevelView level={level} availability={availability} />;
}
