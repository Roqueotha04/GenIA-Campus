import { regenerateCourseKey } from "@/lib/admin/course-actions";
import { AdminForm } from "./AdminForm";

interface CourseKeyPanelProps {
  courseId: string;
  enrollmentKey: string;
}

export function CourseKeyPanel({ courseId, enrollmentKey }: CourseKeyPanelProps) {
  return (
    <div className="space-y-4">
      <p className="font-mono text-2xl font-semibold tracking-[0.2em] text-foreground">
        {enrollmentKey || "Sin clave"}
      </p>
      <AdminForm
        action={regenerateCourseKey}
        submitLabel="Regenerar clave"
        pendingLabel="Regenerando..."
        variant="outline"
      >
        <input type="hidden" name="id" value={courseId} />
      </AdminForm>
    </div>
  );
}
