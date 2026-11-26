import { ADMIN_COURSES_PATH, buildAdminUsersListPath } from "@/lib/admin/admin-paths";
import type { CourseCountsByStatus, ProfileCountsByRole } from "@/lib/admin/admin-queries";
import { AdminStatCard } from "./AdminStatCard";
import { AdminStatGroup } from "./AdminStatGroup";

interface AdminOverviewProps {
  profileCounts: ProfileCountsByRole;
  courseCounts: CourseCountsByStatus;
}

export function AdminOverview({ profileCounts, courseCounts }: AdminOverviewProps) {
  return (
    <div className="space-y-6">
      <AdminStatGroup title="Usuarios">
        <AdminStatCard
          href={buildAdminUsersListPath({ role: "alumno", searchTerm: "" })}
          label="Alumnos"
          value={profileCounts.alumno}
        />
        <AdminStatCard
          href={buildAdminUsersListPath({ role: "docente", searchTerm: "" })}
          label="Docentes"
          value={profileCounts.docente}
        />
        <AdminStatCard
          href={buildAdminUsersListPath({ role: "admin", searchTerm: "" })}
          label="Admins"
          value={profileCounts.admin}
        />
      </AdminStatGroup>
      <AdminStatGroup title="Cursos">
        <AdminStatCard href={ADMIN_COURSES_PATH} label="Publicados" value={courseCounts.published} />
        <AdminStatCard href={ADMIN_COURSES_PATH} label="En borrador" value={courseCounts.draft} />
      </AdminStatGroup>
    </div>
  );
}
