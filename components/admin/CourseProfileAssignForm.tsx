import { SelectField } from "@/components/ui/SelectField";
import type { FormState } from "@/lib/forms/form-state";
import type { AdminProfile } from "@/lib/admin/admin-queries";
import { AdminEmptyState } from "./AdminEmptyState";
import { AdminForm } from "./AdminForm";

interface CourseProfileAssignFormProps {
  action: (previousState: FormState, formData: FormData) => Promise<FormState>;
  courseId: string;
  fieldName: "teacherId" | "studentId";
  fieldLabel: string;
  placeholder: string;
  submitLabel: string;
  emptyMessage: string;
  candidates: AdminProfile[];
}

export function CourseProfileAssignForm({
  action,
  courseId,
  fieldName,
  fieldLabel,
  placeholder,
  submitLabel,
  emptyMessage,
  candidates,
}: CourseProfileAssignFormProps) {
  if (candidates.length === 0) return <AdminEmptyState message={emptyMessage} />;

  const options = [
    { value: "", label: placeholder },
    ...candidates.map((profile) => ({
      value: profile.id,
      label: `${profile.full_name} (${profile.email})`,
    })),
  ];

  return (
    <AdminForm action={action} submitLabel={submitLabel} pendingLabel="Guardando..." variant="outline">
      <input type="hidden" name="courseId" value={courseId} />
      <SelectField label={fieldLabel} name={fieldName} options={options} required />
    </AdminForm>
  );
}
