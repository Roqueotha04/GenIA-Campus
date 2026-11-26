"use client";

import { useActionState } from "react";
import { enrollInCourse } from "@/lib/course-content/enroll-in-course";
import { idleFormState } from "@/lib/forms/form-state";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { TextField } from "@/components/ui/TextField";

export function EnrollmentForm({ courseId }: { courseId: string }) {
  const [state, formAction] = useActionState(enrollInCourse, idleFormState);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-6">
      <input type="hidden" name="courseId" value={courseId} />
      <TextField
        label="Ingresá la clave del curso"
        name="enrollmentKey"
        autoComplete="off"
        required
        hint="Te la da tu docente."
      />
      <FormStateMessage state={state} />
      <SubmitButton pendingLabel="Verificando…">Anotarme en el curso</SubmitButton>
    </form>
  );
}
