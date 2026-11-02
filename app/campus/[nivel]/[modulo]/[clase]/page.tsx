import { notFound, redirect } from "next/navigation";
import { buildModuleHref, findClassContext } from "@/lib/catalog";

interface ClassPageProps {
  params: Promise<{ nivel: string; modulo: string; clase: string }>;
}

export default async function ClassPage({ params }: ClassPageProps) {
  const { nivel, modulo, clase } = await params;
  const classContext = findClassContext(nivel, modulo, clase);
  if (!classContext) notFound();

  redirect(buildModuleHref(classContext.level, classContext.courseModule));
}
