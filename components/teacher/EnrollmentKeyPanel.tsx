"use client";

import { useState } from "react";
import { ActionButton } from "@/components/ui/Button";
import { regenerateEnrollmentKeyAction } from "@/lib/teacher/enrollment-key-actions";
import { ConfirmActionForm } from "./ConfirmActionForm";

interface EnrollmentKeyPanelProps {
  courseId: string;
  enrollmentKey: string;
}

export function EnrollmentKeyPanel({ courseId, enrollmentKey }: EnrollmentKeyPanelProps) {
  const [copyFailed, setCopyFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(enrollmentKey);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopied(false);
      setCopyFailed(true);
    }
  }

  return (
    <div className="rounded-sm border border-line bg-surface p-4 md:p-5">
      <h2 className="text-base font-semibold text-foreground">Clave de inscripción</h2>
      <p className="mt-1 text-sm text-muted">
        Compartila con tus alumnos: la ingresan en el campus para sumarse a este curso.
      </p>
      <p
        aria-label="Clave de inscripción"
        className="mt-3 break-all text-2xl font-semibold tracking-[0.12em] text-foreground md:text-3xl"
      >
        {enrollmentKey || "Sin clave"}
      </p>
      <div className="mt-4 flex flex-wrap items-start gap-3">
        <ActionButton variant="primary" size="sm" onClick={copyKey} disabled={!enrollmentKey}>
          {copied ? "Clave copiada" : "Copiar clave"}
        </ActionButton>
        <ConfirmActionForm
          action={regenerateEnrollmentKeyAction}
          hiddenFields={{ courseId }}
          label="Regenerar clave"
          confirmLabel="Sí, regenerar"
          pendingLabel="Regenerando…"
          warning="La clave actual dejará de funcionar. Los alumnos ya inscriptos no se ven afectados."
        />
      </div>
      {copyFailed && (
        <p role="alert" className="mt-4 border-l-2 border-danger pl-3 text-sm text-danger">
          No pudimos copiar la clave. Seleccionala y copiala a mano.
        </p>
      )}
    </div>
  );
}
