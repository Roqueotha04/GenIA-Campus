import Link from "next/link";
import { buildAdminCoursePath } from "@/lib/admin/admin-paths";
import { describeCourseModule } from "@/lib/admin/course-options";
import type { CourseSummary } from "@/lib/courses/course-access";
import { AdminEmptyState } from "./AdminEmptyState";
import { ConfirmActionForm } from "./ConfirmActionForm";
import type { ProfileCourseMembershipSettings } from "./profileCourseMembership";

interface ProfileCourseListProps {
  profileId: string;
  courses: CourseSummary[];
  settings: ProfileCourseMembershipSettings;
}

export function ProfileCourseList({ profileId, courses, settings }: ProfileCourseListProps) {
  if (courses.length === 0) return <AdminEmptyState message={settings.emptyAssignedMessage} />;

  return (
    <ul className="divide-y divide-line border-y border-line">
      {courses.map((course) => (
        <li key={course.id} className="space-y-2 py-3">
          <div className="min-w-0">
            <Link
              href={buildAdminCoursePath(course.id)}
              className="text-sm font-medium text-foreground hover:text-primary"
            >
              {course.title}
            </Link>
            <p className="text-xs text-muted">
              {describeCourseModule(course.level_slug, course.module_number)}
            </p>
          </div>
          <ConfirmActionForm
            action={settings.removeAction}
            hiddenFields={{ courseId: course.id, [settings.memberFieldName]: profileId }}
            label="Quitar"
            confirmLabel="Confirmar"
            pendingLabel="Quitando..."
          />
        </li>
      ))}
    </ul>
  );
}
