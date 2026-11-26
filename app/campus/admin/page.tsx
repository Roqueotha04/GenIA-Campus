import type { Metadata } from "next";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminShortcut } from "@/components/admin/AdminShortcut";
import { ADMIN_COURSES_PATH, ADMIN_USERS_PATH } from "@/lib/admin/admin-paths";
import { countRows } from "@/lib/admin/admin-queries";

export const metadata: Metadata = { title: "Administración" };

export default async function AdminHomePage() {
  const [userCount, courseCount] = await Promise.all([countRows("profiles"), countRows("courses")]);

  return (
    <AdminPage
      breadcrumb={[{ label: "Campus", href: "/campus" }, { label: "Administración" }]}
      title="Administración"
      subtitle="Creá cuentas, asigná docentes y manejá quién cursa cada módulo."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <AdminShortcut
          href={ADMIN_USERS_PATH}
          title="Usuarios"
          description="Creá cuentas, cambiá roles, reseteá contraseñas y desactivá accesos."
          count={userCount}
          countLabel="Usuarios"
        />
        <AdminShortcut
          href={ADMIN_COURSES_PATH}
          title="Cursos"
          description="Creá cursos por módulo, asigná docentes e inscribí alumnos."
          count={courseCount}
          countLabel="Cursos"
        />
      </div>
    </AdminPage>
  );
}
