import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import { countCoursesByStatus, countProfilesByRole } from "@/lib/admin/admin-queries";

export const metadata: Metadata = { title: "Administración" };

export default async function AdminHomePage() {
  const [profileCounts, courseCounts] = await Promise.all([
    countProfilesByRole(),
    countCoursesByStatus(),
  ]);

  return (
    <AdminPage
      title="Resumen"
      subtitle="Creá cuentas, asigná docentes y manejá quién cursa cada módulo."
      actions={<AdminQuickActions />}
    >
      <AdminOverview profileCounts={profileCounts} courseCounts={courseCounts} />
    </AdminPage>
  );
}
