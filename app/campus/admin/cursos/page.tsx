import type { Metadata } from "next";
import { AdminPage } from "@/components/admin/AdminPage";
import { CourseCreationPanel } from "@/components/admin/CourseCreationPanel";
import { CourseList } from "@/components/admin/CourseList";
import { CreationPanelProvider } from "@/components/admin/CreationPanelProvider";
import { CreationSuccessAlert } from "@/components/admin/CreationSuccessAlert";
import { OpenCreationPanelButton } from "@/components/admin/OpenCreationPanelButton";
import { ResultCount } from "@/components/admin/ResultCount";
import { NEW_ENTITY_FLAG } from "@/lib/admin/admin-paths";
import { listCoursesWithCounts } from "@/lib/admin/admin-queries";
import { courseModuleOptions } from "@/lib/admin/course-options";

export const metadata: Metadata = { title: "Cursos" };

interface AdminCoursesPageProps {
  searchParams: Promise<{ nuevo?: string }>;
}

export default async function AdminCoursesPage({ searchParams }: AdminCoursesPageProps) {
  const [{ nuevo }, courses] = await Promise.all([searchParams, listCoursesWithCounts()]);

  return (
    <CreationPanelProvider initiallyOpen={nuevo === NEW_ENTITY_FLAG}>
      <AdminPage
        title="Cursos"
        subtitle="Cada curso corresponde a un módulo del campus. Entrá a uno para manejar docentes y alumnos."
        actions={<OpenCreationPanelButton label="Nuevo curso" />}
      >
        <CreationSuccessAlert />
        <ResultCount count={courses.length} singularLabel="curso" pluralLabel="cursos" />
        <CourseList courses={courses} />
      </AdminPage>
      <CourseCreationPanel moduleOptions={courseModuleOptions} />
    </CreationPanelProvider>
  );
}
