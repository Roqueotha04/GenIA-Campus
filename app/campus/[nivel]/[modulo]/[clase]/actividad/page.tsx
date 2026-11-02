import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActivityView } from "@/components/campus/ActivityView";
import { findClassContext } from "@/lib/catalog";

interface ActivityPageProps {
  params: Promise<{ nivel: string; modulo: string; clase: string }>;
}

export async function generateMetadata({ params }: ActivityPageProps): Promise<Metadata> {
  const { nivel, modulo, clase } = await params;
  const activity = findClassContext(nivel, modulo, clase)?.courseClass.activity;
  return { title: activity?.title ?? "Cuestionario" };
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { nivel, modulo, clase } = await params;
  const classContext = findClassContext(nivel, modulo, clase);
  const activity = classContext?.courseClass.activity;
  if (!classContext || !activity) notFound();

  return <ActivityView {...classContext} activity={activity} />;
}
