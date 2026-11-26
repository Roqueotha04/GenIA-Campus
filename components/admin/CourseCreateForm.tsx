import { CheckboxField } from "@/components/ui/CheckboxField";
import { SelectField, type SelectOption } from "@/components/ui/SelectField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import { createCourse } from "@/lib/admin/course-actions";
import { AdminForm } from "./AdminForm";

interface CourseCreateFormProps {
  moduleOptions: SelectOption[];
  onSuccess: (message: string) => void;
}

export function CourseCreateForm({ moduleOptions, onSuccess }: CourseCreateFormProps) {
  return (
    <AdminForm
      action={createCourse}
      submitLabel="Crear curso"
      pendingLabel="Creando curso..."
      onSuccess={onSuccess}
    >
      <p className="text-sm text-muted">
        Hay un solo curso por nivel y módulo. Si ya existe, lo encontrás en el listado.
      </p>
      <SelectField label="Nivel y módulo" name="moduleKey" options={moduleOptions} required />
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
