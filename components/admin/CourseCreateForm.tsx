import { CheckboxField } from "@/components/ui/CheckboxField";
import { SelectField } from "@/components/ui/SelectField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import { courseModuleOptions } from "@/lib/admin/course-options";
import { createCourse } from "@/lib/admin/course-actions";
import { AdminForm } from "./AdminForm";

export function CourseCreateForm() {
  return (
    <AdminForm action={createCourse} submitLabel="Crear curso" pendingLabel="Creando curso...">
      <SelectField label="Nivel y módulo" name="moduleKey" options={courseModuleOptions} required />
      <TextField
        label="Título"
        name="title"
        hint="Si lo dejás vacío, usamos el nivel y el módulo, por ejemplo Adultos · Módulo 1."
      />
      <TextAreaField label="Descripción" name="description" />
      <CheckboxField label="Publicar el curso para que los alumnos lo vean" name="isPublished" />
    </AdminForm>
  );
}
