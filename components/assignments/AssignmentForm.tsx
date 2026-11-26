"use client";

import { useState, useTransition, type FormEvent } from "react";
import { ActionButton } from "@/components/ui/Button";
import { CheckboxField } from "@/components/ui/CheckboxField";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import { createAssignment, updateAssignment } from "@/lib/assignments/assignment-actions";
import { isoToArgentinaLocal } from "@/lib/assignments/assignment-time";
import type { ManagedAssignment } from "@/lib/assignments/assignment-types";
import { uploadDirectly } from "@/lib/assignments/upload-to-signed-url";
import { errorState, idleFormState, type FormState } from "@/lib/forms/form-state";
import { COURSE_MATERIALS_BUCKET } from "@/lib/storage/storage-buckets";
import { prepareMaterialUpload } from "@/lib/teacher/material-upload-actions";
import { FileInputField } from "./FileInputField";

const DEFAULT_MAX_GRADE = "10";

type AssignmentFormProps =
  | { mode: "create"; sectionId: string }
  | { mode: "edit"; assignment: ManagedAssignment };

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function AssignmentForm(props: AssignmentFormProps) {
  const assignment = props.mode === "edit" ? props.assignment : null;
  const sectionId = props.mode === "edit" ? props.assignment.section_id : props.sectionId;
  const [attachment, setAttachment] = useState<File | null>(null);
  const [state, setState] = useState<FormState>(idleFormState);
  const [isSaving, startSaving] = useTransition();

  async function save(formData: FormData): Promise<FormState> {
    let uploaded: { path: string; name: string } | null = null;
    if (attachment) {
      const outcome = await uploadDirectly({
        file: attachment,
        bucket: COURSE_MATERIALS_BUCKET,
        prepare: (fileName, sizeBytes) => prepareMaterialUpload(sectionId, fileName, sizeBytes),
      });
      if (!outcome.uploaded) return errorState(outcome.message);
      uploaded = { path: outcome.path, name: outcome.name };
    }

    const fields = {
      title: readText(formData, "title"),
      instructions: readText(formData, "instructions"),
      dueAt: readText(formData, "dueAt"),
      maxGrade: Number(readText(formData, "maxGrade")),
      allowLate: formData.get("allowLate") === "on",
      attachment: uploaded,
    };

    if (props.mode === "edit") {
      return updateAssignment({
        ...fields,
        assignmentId: props.assignment.id,
        removeAttachment: formData.get("removeAttachment") === "on",
      });
    }
    return createAssignment({ ...fields, sectionId });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startSaving(async () => {
      const result = await save(formData);
      setState(result);
      if (result.status === "success" && props.mode === "create") {
        form.reset();
        setAttachment(null);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <TextField label="Título" name="title" defaultValue={assignment?.title} required />
      <TextAreaField
        label="Consigna"
        name="instructions"
        defaultValue={assignment?.instructions}
        rows={5}
        hint="Explicá qué tienen que entregar y cómo se evalúa."
      />
      <FileInputField
        label={props.mode === "edit" ? "Reemplazar adjunto (opcional)" : "Adjunto (opcional)"}
        disabled={isSaving}
        onFileChange={setAttachment}
      />
      {assignment?.attachment_name && (
        <div className="space-y-2">
          <p className="break-all text-sm text-muted">Adjunto actual: {assignment.attachment_name}</p>
          <CheckboxField label="Quitar el adjunto actual" name="removeAttachment" />
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Fecha límite (hora de Argentina)"
          name="dueAt"
          type="datetime-local"
          defaultValue={isoToArgentinaLocal(assignment?.due_at ?? null)}
          hint="Dejala vacía si no hay fecha límite."
        />
        <TextField
          label="Nota máxima"
          name="maxGrade"
          type="number"
          defaultValue={assignment ? String(assignment.max_grade) : DEFAULT_MAX_GRADE}
          required
        />
      </div>
      <CheckboxField label="Aceptar entregas fuera de término" name="allowLate" defaultChecked={assignment?.allow_late} />
      <FormStateMessage state={state} />
      <ActionButton type="submit" size="sm" disabled={isSaving}>
        {isSaving ? "Guardando…" : props.mode === "edit" ? "Guardar cambios" : "Crear entrega"}
      </ActionButton>
    </form>
  );
}
