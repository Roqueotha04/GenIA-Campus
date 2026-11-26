"use client";

import { useState, useTransition, type FormEvent } from "react";
import { ActionButton } from "@/components/ui/Button";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import { prepareSubmissionUpload, submitAssignment } from "@/lib/assignments/submission-actions";
import { uploadDirectly } from "@/lib/assignments/upload-to-signed-url";
import { errorState, idleFormState, type FormState } from "@/lib/forms/form-state";
import { SUBMISSIONS_BUCKET } from "@/lib/storage/storage-buckets";
import { FileInputField } from "./FileInputField";

interface SubmissionFormProps {
  assignmentId: string;
  textAnswer: string | null;
  linkUrl: string | null;
  fileName: string | null;
}

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function SubmissionForm({ assignmentId, textAnswer, linkUrl, fileName }: SubmissionFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<FormState>(idleFormState);
  const [isSending, startSending] = useTransition();
  const isResubmission = Boolean(textAnswer || linkUrl || fileName);

  async function send(formData: FormData): Promise<FormState> {
    let uploaded: { path: string; name: string } | null = null;
    if (file) {
      const outcome = await uploadDirectly({
        file,
        bucket: SUBMISSIONS_BUCKET,
        prepare: (name, sizeBytes) => prepareSubmissionUpload(assignmentId, name, sizeBytes),
      });
      if (!outcome.uploaded) return errorState(outcome.message);
      uploaded = { path: outcome.path, name: outcome.name };
    }

    return submitAssignment({
      assignmentId,
      textAnswer: readText(formData, "textAnswer"),
      linkUrl: readText(formData, "linkUrl"),
      file: uploaded,
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startSending(async () => {
      const result = await send(formData);
      setState(result);
      if (result.status === "success") setFile(null);
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <TextAreaField label="Respuesta (opcional)" name="textAnswer" defaultValue={textAnswer ?? ""} rows={6} />
      <TextField
        label="Enlace (opcional)"
        name="linkUrl"
        type="url"
        defaultValue={linkUrl ?? ""}
        hint="Pegá la dirección completa, por ejemplo un documento de Google Drive."
      />
      <FileInputField
        label="Archivo (opcional)"
        disabled={isSending}
        onFileChange={setFile}
        hint={
          fileName
            ? `Ya subiste ${fileName}. Si elegís otro archivo, lo reemplaza.`
            : "Hasta 50 MB. PDF, Office, imágenes, ZIP o texto."
        }
      />
      <p className="text-xs text-muted">Tenés que completar al menos una de las tres opciones.</p>
      <FormStateMessage state={state} />
      <ActionButton type="submit" disabled={isSending}>
        {isSending ? "Enviando…" : isResubmission ? "Reenviar entrega" : "Entregar"}
      </ActionButton>
    </form>
  );
}
