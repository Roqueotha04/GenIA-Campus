import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModuleView } from "@/components/campus/ModuleView";
import { findLevel, findModule } from "@/lib/catalog";

interface ModulePageProps {
  params: Promise<{ nivel: string; modulo: string }>;
}

export async function generateMetadata({ params }: ModulePageProps): Promise<Metadata> {
  const { nivel, modulo } = await params;
  const level = findLevel(nivel);
  const courseModule = level && findModule(level, modulo);
  return { title: level && courseModule ? `${level.name} · Módulo ${courseModule.number}` : "Módulo" };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { nivel, modulo } = await params;
  const level = findLevel(nivel);
  const courseModule = level && findModule(level, modulo);
  if (!level || !courseModule) notFound();

  return <ModuleView level={level} courseModule={courseModule} />;
}
