import { SelectField } from "@/components/ui/SelectField";
import { describeCourseModule } from "@/lib/admin/course-options";
import type { CourseSummary } from "@/lib/courses/course-access";
import { AdminEmptyState } from "./AdminEmptyState";
import { AdminForm } from "./AdminForm";
import type { ProfileCourseMembershipSettings } from "./profileCourseMembership";

interface ProfileCourseAssignFormProps {
  profileId: string;
  courses: CourseSummary[];
  settings: ProfileCourseMembershipSettings;
}

export function ProfileCourseAssignForm({ profileId, courses, settings }: ProfileCourseAssignFormProps) {
  if (courses.length === 0) return <AdminEmptyState message={settings.noCoursesLeftMessage} />;

  const options = [
    { value: "", label: "Elegí un curso" },
    ...courses.map((course) => ({
      value: course.id,
      label: `${course.title} (${describeCourseModule(course.level_slug, course.module_number)})`,
    })),
  ];

  return (
    <AdminForm
      action={settings.assignAction}
      submitLabel={settings.submitLabel}
      pendingLabel="Guardando..."
      variant="outline"
    >
      <input type="hidden" name={settings.memberFieldName} value={profileId} />
      <SelectField label={settings.selectLabel} name="courseId" options={options} required />
    </AdminForm>
  );
}
