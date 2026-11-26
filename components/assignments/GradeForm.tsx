"use client";

import { useState, useTransition, type FormEvent } from "react";
import { ActionButton } from "@/components/ui/Button";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import { gradeSubmission } from "@/lib/assignments/submission-actions";
import { idleFormState, type FormState } from "@/lib/forms/form-state";

interface GradeFormProps {
  submissionId: string;
  maxGrade: number;
  grade: number | null;
  feedback: string | null;
}

export function GradeForm({ submissionId, maxGrade, grade, feedback }: GradeFormProps) {
  const [state, setState] = useState<FormState>(idleFormState);
  const [isSaving, startSaving] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const rawGrade = formData.get("grade");
    const rawFeedback = formData.get("feedback");

    startSaving(async () => {
      const result = await gradeSubmission({
        submissionId,
        grade: typeof rawGrade === "string" && rawGrade.trim() !== "" ? Number(rawGrade) : Number.NaN,
        feedback: typeof rawFeedback === "string" ? rawFeedback : "",
      });
      setState(result);
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <TextField
        label={`Nota (0 a ${maxGrade})`}
        name="grade"
        type="number"
        defaultValue={grade === null ? "" : String(grade)}
        required
      />
      <TextAreaField label="Devolución" name="feedback" defaultValue={feedback ?? ""} rows={4} />
      <FormStateMessage state={state} />
      <ActionButton type="submit" size="sm" disabled={isSaving}>
        {isSaving ? "Guardando…" : grade === null ? "Guardar corrección" : "Actualizar corrección"}
      </ActionButton>
    </form>
  );
}
