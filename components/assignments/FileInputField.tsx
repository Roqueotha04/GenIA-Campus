"use client";

import { useId, type ChangeEvent } from "react";
import { ACCEPTED_UPLOAD_TYPES, MAX_UPLOAD_BYTES } from "@/lib/storage/storage-buckets";

const MAX_UPLOAD_MEGABYTES = MAX_UPLOAD_BYTES / (1024 * 1024);

interface FileInputFieldProps {
  label: string;
  disabled: boolean;
  onFileChange: (file: File | null) => void;
  hint?: string;
}

export function FileInputField({ label, disabled, onFileChange, hint }: FileInputFieldProps) {
  const inputId = useId();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onFileChange(event.target.files?.[0] ?? null);
  }

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={inputId}
        type="file"
        accept={ACCEPTED_UPLOAD_TYPES}
        onChange={handleChange}
        disabled={disabled}
        className="mt-2 block w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-foreground"
      />
      <p className="mt-2 text-xs text-muted">
        {hint ?? `Hasta ${MAX_UPLOAD_MEGABYTES} MB. PDF, Office, imágenes, ZIP o texto.`}
      </p>
    </div>
  );
}
