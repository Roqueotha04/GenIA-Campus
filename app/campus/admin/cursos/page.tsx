import type { Metadata } from "next";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { CourseCreateForm } from "@/components/admin/CourseCreateForm";
import { CourseList } from "@/components/admin/CourseList";
import { ADMIN_PATH } from "@/lib/admin/admin-paths";
import { listCoursesWithCounts } from "@/lib/admin/admin-queries";

export const metadata: Metadata = { title: "Cursos" };

export default async function AdminCoursesPage() {
  const courses = await listCoursesWithCounts();

  return (
    <AdminPage
      breadcrumb={[
        { label: "Campus", href: "/campus" },
        { label: "Administración", href: ADMIN_PATH },
        { label: "Cursos" },
      ]}
      title="Cursos"
      subtitle="Cada curso corresponde a un módulo del campus. Entrá a uno para manejar docentes y alumnos."
    >
      <CourseList courses={courses} />
      <AdminPanel
        title="Crear curso"
        description="Hay un solo curso por nivel y módulo. Si ya existe, lo encontrás en el listado."
      >
        <CourseCreateForm />
      </AdminPanel>
    </AdminPage>
  );
}
