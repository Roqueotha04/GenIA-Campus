"use client";

import { useState } from "react";
import { QuizResourceForm } from "@/components/quizzes/QuizResourceForm";
import { TextField } from "@/components/ui/TextField";
import { createSectionQuizAction } from "@/lib/quizzes/quiz-actions";
import { ActionForm } from "./ActionForm";

interface QuizActivityFormProps {
  sectionId: string;
  onCreated?: () => void;
}

const switchLinkClasses = "text-sm font-medium text-primary underline-offset-4 hover:underline";

export function QuizActivityForm({ sectionId, onCreated }: QuizActivityFormProps) {
  const [isPickingPublished, setIsPickingPublished] = useState(false);

  if (isPickingPublished) {
    return (
      <div className="space-y-5">
        <QuizResourceForm sectionId={sectionId} onCreated={onCreated} />
        <button type="button" onClick={() => setIsPickingPublished(false)} className={switchLinkClasses}>
          Crear un cuestionario nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ActionForm
        action={createSectionQuizAction}
        hiddenFields={{ sectionId }}
        submitLabel="Crear y cargar preguntas"
        pendingLabel="Creando…"
      >
        <TextField
          label="Nombre"
          name="title"
          required
          hint="Después cargás las preguntas. Cuando lo publiques, aparece en esta sección."
        />
      </ActionForm>
      <button type="button" onClick={() => setIsPickingPublished(true)} className={switchLinkClasses}>
        Agregar un cuestionario ya publicado
      </button>
    </div>
  );
}
