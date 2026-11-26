"use client";

import { useEffect, useState } from "react";
import { ActionForm } from "@/components/teacher/ActionForm";
import { SelectField } from "@/components/ui/SelectField";
import {
  createQuizResourceAction,
  loadPublishedQuizOptionsAction,
  type PublishedQuizOption,
} from "@/lib/quizzes/quiz-resource-actions";

export function QuizResourceForm({ sectionId }: { sectionId: string }) {
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
        No hay cuestionarios publicados en este curso. Creá uno y publicalo desde Cuestionarios.
      </p>
    );
  }

  return (
    <ActionForm
      action={createQuizResourceAction}
      hiddenFields={{ sectionId }}
      submitLabel="Agregar cuestionario"
      pendingLabel="Agregando…"
    >
      <SelectField label="Cuestionario" name="quizId" options={options} required />
    </ActionForm>
  );
}
