import type { ProfileCourseMembership } from "@/lib/admin/admin-queries";
import { AdminPanel } from "./AdminPanel";
import { ProfileCourseAssignForm } from "./ProfileCourseAssignForm";
import { ProfileCourseList } from "./ProfileCourseList";
import { profileCourseMembershipSettings } from "./profileCourseMembership";

interface ProfileCoursesPanelProps {
  profileId: string;
  membership: ProfileCourseMembership | null;
}

export function ProfileCoursesPanel({ profileId, membership }: ProfileCoursesPanelProps) {
  if (!membership) {
    return (
      <AdminPanel title="Cursos">
        <p className="text-sm text-muted">
          Los administradores ven y gestionan todos los cursos. No hace falta asignarlos.
        </p>
      </AdminPanel>
    );
  }

  const settings = profileCourseMembershipSettings[membership.role];

  return (
    <AdminPanel title="Cursos" description={settings.description}>
      <div className="space-y-4">
        <ProfileCourseList
          profileId={profileId}
          courses={membership.assignedCourses}
          settings={settings}
        />
        <ProfileCourseAssignForm
          profileId={profileId}
          courses={membership.assignableCourses}
          settings={settings}
        />
      </div>
    </AdminPanel>
  );
}
