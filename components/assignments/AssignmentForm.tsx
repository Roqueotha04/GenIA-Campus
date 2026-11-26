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

interface UploadedAttachment {
  path: string;
  name: string;
}

type AttachmentUpload = { uploaded: true; attachment: UploadedAttachment | null } | { uploaded: false; state: FormState };

interface AssignmentFormProps {
  sectionId: string;
  assignment?: ManagedAssignment;
  onSaved?: () => void;
}

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function AssignmentForm({ sectionId, assignment, onSaved }: AssignmentFormProps) {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [state, setState] = useState<FormState>(idleFormState);
  const [isSaving, startSaving] = useTransition();

  async function uploadAttachment(): Promise<AttachmentUpload> {
    if (!attachment) return { uploaded: true, attachment: null };
    const outcome = await uploadDirectly({
      file: attachment,
      bucket: COURSE_MATERIALS_BUCKET,
      prepare: (fileName, sizeBytes) => prepareMaterialUpload(sectionId, fileName, sizeBytes),
    });
    if (!outcome.uploaded) return { uploaded: false, state: errorState(outcome.message) };
    return { uploaded: true, attachment: { path: outcome.path, name: outcome.name } };
  }

  async function save(formData: FormData): Promise<FormState> {
    const upload = await uploadAttachment();
    if (!upload.uploaded) return upload.state;

    const fields = {
      title: readText(formData, "title"),
      instructions: readText(formData, "instructions"),
      dueAt: readText(formData, "dueAt"),
      cutoffAt: readText(formData, "cutoffAt"),
      maxGrade: Number(readText(formData, "maxGrade")),
      attachment: upload.attachment,
    };

    if (assignment) {
      return updateAssignment({
        ...fields,
        assignmentId: assignment.id,
        removeAttachment: formData.get("removeAttachment") === "on",
      });
    }
    return createAssignment({ ...fields, sectionId });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startSaving(async () => {
      const result = await save(formData);
      setState(result);
      if (result.status === "success") onSaved?.();
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <TextField label="Nombre" name="title" defaultValue={assignment?.title} required />
      <TextAreaField
        label="Consigna"
        name="instructions"
        defaultValue={assignment?.instructions}
        rows={5}
        hint="Explicá qué tienen que entregar y cómo se evalúa."
      />
      <FileInputField
        label={assignment ? "Reemplazar adjunto (opcional)" : "Adjunto (opcional)"}
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
          label="Fecha de entrega"
          name="dueAt"
          type="datetime-local"
          defaultValue={isoToArgentinaLocal(assignment?.due_at ?? null)}
          hint="Hora de Argentina. Después de esta fecha, las entregas quedan fuera de término."
        />
        <TextField
          label="Fecha límite real"
          name="cutoffAt"
          type="datetime-local"
          defaultValue={isoToArgentinaLocal(assignment?.cutoff_at ?? null)}
          hint="Después de esta fecha no se aceptan entregas. Si la dejás vacía, no cierra."
        />
      </div>
      <TextField
        label="Nota máxima"
        name="maxGrade"
        type="number"
        defaultValue={assignment ? String(assignment.max_grade) : DEFAULT_MAX_GRADE}
        required
      />
      <FormStateMessage state={state} />
      <ActionButton type="submit" size="sm" disabled={isSaving}>
        {isSaving ? "Guardando…" : assignment ? "Guardar cambios" : "Crear tarea"}
      </ActionButton>
    </form>
  );
}
