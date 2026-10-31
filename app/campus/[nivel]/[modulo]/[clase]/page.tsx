import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClassView } from "@/components/campus/ClassView";
import { findClass, findLevel, findModule } from "@/lib/catalog";

interface ClassPageProps {
  params: Promise<{ nivel: string; modulo: string; clase: string }>;
}

async function resolveClass({ params }: ClassPageProps) {
  const { nivel, modulo, clase } = await params;
  const level = findLevel(nivel);
  const courseModule = level && findModule(level, modulo);
  const courseClass = courseModule && findClass(courseModule, clase);
  return { level, courseModule, courseClass };
}

export async function generateMetadata(props: ClassPageProps): Promise<Metadata> {
  const { courseClass } = await resolveClass(props);
  return { title: courseClass?.title ?? "Clase" };
}

export default async function ClassPage(props: ClassPageProps) {
  const { level, courseModule, courseClass } = await resolveClass(props);
  if (!level || !courseModule || !courseClass) notFound();

  return <ClassView level={level} courseModule={courseModule} courseClass={courseClass} />;
}
