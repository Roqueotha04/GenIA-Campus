import type { FormState } from "@/lib/forms/form-state";
import type { AdminProfile } from "@/lib/admin/admin-queries";
import { AdminEmptyState } from "./AdminEmptyState";
import { ConfirmActionForm } from "./ConfirmActionForm";

interface CourseMemberListProps {
  members: AdminProfile[];
  courseId: string;
  memberFieldName: "teacherId" | "studentId";
  removeAction: (previousState: FormState, formData: FormData) => Promise<FormState>;
  removeLabel: string;
  emptyMessage: string;
}

export function CourseMemberList({
  members,
  courseId,
  memberFieldName,
  removeAction,
  removeLabel,
  emptyMessage,
}: CourseMemberListProps) {
  if (members.length === 0) return <AdminEmptyState message={emptyMessage} />;

  return (
    <ul className="divide-y divide-line border-y border-line">
      {members.map((member) => (
        <li
          key={member.id}
          className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="font-medium text-foreground">{member.full_name}</p>
            <p className="break-all text-sm text-muted">{member.email}</p>
          </div>
          <ConfirmActionForm
            action={removeAction}
            hiddenFields={{ courseId, [memberFieldName]: member.id }}
            label={removeLabel}
            confirmLabel="Confirmar"
            pendingLabel="Quitando..."
          />
        </li>
      ))}
    </ul>
  );
}
