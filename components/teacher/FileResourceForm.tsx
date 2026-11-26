"use client";

import { useId, useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { ActionButton } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { errorState, idleFormState, successState, type FormState } from "@/lib/forms/form-state";
import { ACCEPTED_UPLOAD_TYPES, COURSE_MATERIALS_BUCKET, MAX_UPLOAD_BYTES } from "@/lib/storage/storage-buckets";
import { prepareMaterialUpload, registerMaterial } from "@/lib/teacher/material-upload-actions";
import { removeFileExtension } from "@/lib/teacher/file-names";

const MAX_UPLOAD_MEGABYTES = MAX_UPLOAD_BYTES / (1024 * 1024);

export function FileResourceForm({ sectionId }: { sectionId: string }) {
  const fileInputId = useId();
  const titleInputId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [state, setState] = useState<FormState>(idleFormState);
  const [isUploading, startUpload] = useTransition();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setTitle(selected ? removeFileExtension(selected.name) : "");
    setState(idleFormState);
  }

  async function upload(selected: File, resourceTitle: string): Promise<FormState> {
    const prepared = await prepareMaterialUpload(sectionId, selected.name, selected.size);
    if (!prepared.prepared) return errorState(prepared.message);

    const { error } = await createSupabaseBrowserClient()
      .storage.from(COURSE_MATERIALS_BUCKET)
      .uploadToSignedUrl(prepared.path, prepared.token, selected, { contentType: selected.type });
    if (error) return errorState("No pudimos subir el archivo. Revisá tu conexión y probá de nuevo.");

    return registerMaterial({
      sectionId,
      title: resourceTitle,
      storagePath: prepared.path,
      mimeType: selected.type,
      sizeBytes: selected.size,
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!file) return setState(errorState("Elegí un archivo para subir."));
    if (file.size > MAX_UPLOAD_BYTES) {
      return setState(errorState(`El archivo supera los ${MAX_UPLOAD_MEGABYTES} MB. Comprimilo o subí una versión más liviana.`));
    }
    if (!title.trim()) return setState(errorState("Escribí un título para el archivo."));

    const selected = file;
    startUpload(async () => {
      const result = await upload(selected, title.trim());
      setState(result.status === "success" ? successState("Archivo agregado.") : result);
      if (result.status === "success") {
        form.reset();
        setFile(null);
        setTitle("");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor={fileInputId} className="block text-sm font-medium text-foreground">
          Archivo
        </label>
        <input
          id={fileInputId}
          type="file"
          accept={ACCEPTED_UPLOAD_TYPES}
          onChange={handleFileChange}
          disabled={isUploading}
          className="mt-2 block w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-foreground"
        />
        <p className="mt-2 text-xs text-muted">Hasta {MAX_UPLOAD_MEGABYTES} MB. PDF, Office, imágenes, ZIP o texto.</p>
      </div>
      <div>
        <label htmlFor={titleInputId} className="block text-sm font-medium text-foreground">
          Título
        </label>
        <input
          id={titleInputId}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isUploading}
          className="mt-2 h-12 w-full rounded-sm border border-line bg-surface px-4 text-base text-foreground transition-colors focus:border-primary"
        />
      </div>
      <FormStateMessage state={state} />
      <ActionButton type="submit" size="sm" disabled={isUploading}>
        {isUploading ? "Subiendo…" : "Subir archivo"}
      </ActionButton>
    </form>
  );
}
