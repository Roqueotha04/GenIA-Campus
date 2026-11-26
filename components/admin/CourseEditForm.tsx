import { CheckboxField } from "@/components/ui/CheckboxField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import type { CourseSummary } from "@/lib/courses/course-access";
import { updateCourse } from "@/lib/admin/course-actions";
import { AdminForm } from "./AdminForm";

export function CourseEditForm({ course }: { course: CourseSummary }) {
  return (
    <AdminForm action={updateCourse} submitLabel="Guardar cambios" pendingLabel="Guardando...">
      <input type="hidden" name="id" value={course.id} />
      <TextField label="Título" name="title" defaultValue={course.title} required />
      <TextAreaField label="Descripción" name="description" defaultValue={course.description} />
      <CheckboxField
        label="Publicado: los alumnos inscriptos pueden ver el curso"
        name="isPublished"
        defaultChecked={course.is_published}
      />
    </AdminForm>
  );
}
