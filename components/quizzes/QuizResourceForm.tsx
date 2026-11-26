"use client";

import { useEffect, useState } from "react";
import { ActionForm } from "@/components/teacher/ActionForm";
import { SelectField } from "@/components/ui/SelectField";
import {
  createQuizResourceAction,
  loadPublishedQuizOptionsAction,
  type PublishedQuizOption,
} from "@/lib/quizzes/quiz-resource-actions";

interface QuizResourceFormProps {
  sectionId: string;
  onCreated?: () => void;
}

export function QuizResourceForm({ sectionId, onCreated }: QuizResourceFormProps) {
  const [options, setOptions] = useState<PublishedQuizOption[] | null>(null);

  useEffect(() => {
    let isCurrent = true;
    loadPublishedQuizOptionsAction(sectionId).then((loaded) => {
      if (isCurrent) setOptions(loaded);
    });
    return () => {
      isCurrent = false;
    };
  }, [sectionId]);

  if (options === null) return <p className="text-sm text-muted">Cargando cuestionarios…</p>;

  if (options.length === 0) {
    return (
      <p className="text-sm text-muted">
        Todavía no hay cuestionarios publicados en este curso. Cuando publiques uno, lo vas a poder agregar desde acá.
      </p>
    );
  }

  return (
    <ActionForm
      action={createQuizResourceAction}
      hiddenFields={{ sectionId }}
      submitLabel="Agregar cuestionario"
      pendingLabel="Agregando…"
      onSuccess={onCreated}
    >
      <SelectField label="Cuestionario" name="quizId" options={options} required />
    </ActionForm>
  );
}
