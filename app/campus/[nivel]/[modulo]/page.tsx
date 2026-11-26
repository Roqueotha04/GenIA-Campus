import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModuleView } from "@/components/campus/ModuleView";
import { CourseModuleContent } from "@/components/course/CourseModuleContent";
import { findLevel, findModule } from "@/lib/catalog";
import { findCourseByModule } from "@/lib/courses/course-access";

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

  const course = await findCourseByModule(nivel, modulo);
  if (course) return <CourseModuleContent course={course} />;

  const level = findLevel(nivel);
  const courseModule = level && findModule(level, modulo);
  if (!level || !courseModule) notFound();

  return <ModuleView level={level} courseModule={courseModule} />;
}
