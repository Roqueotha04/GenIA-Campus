import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoticesView } from "@/components/campus/NoticesView";
import { findLevel, findModule } from "@/lib/catalog";

interface NoticesPageProps {
  params: Promise<{ nivel: string; modulo: string }>;
}

export const metadata: Metadata = { title: "Avisos" };

export default async function NoticesPage({ params }: NoticesPageProps) {
  const { nivel, modulo } = await params;
  const level = findLevel(nivel);
  const courseModule = level && findModule(level, modulo);
  if (!level || !courseModule) notFound();

  return <NoticesView level={level} courseModule={courseModule} />;
}
