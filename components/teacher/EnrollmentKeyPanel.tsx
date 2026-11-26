"use client";

import { useState } from "react";
import { ActionButton } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
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
    <div className="border border-line bg-surface p-6 md:p-8">
      <div className="text-muted">
        <Eyebrow>Clave de inscripción</Eyebrow>
      </div>
      <p className="mt-4 text-sm text-muted">
        Compartila con tus alumnos: la ingresan en el campus para sumarse a este curso.
      </p>
      <p
        aria-label="Clave de inscripción"
        className="mt-5 break-all font-heading text-3xl font-semibold tracking-[0.12em] text-foreground md:text-5xl"
      >
        {enrollmentKey || "Sin clave"}
      </p>
      <div className="mt-6 flex flex-wrap items-start gap-3">
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
