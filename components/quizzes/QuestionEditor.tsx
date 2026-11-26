"use client";

import { useState, useTransition, type FormEvent } from "react";
import type { Question } from "@/data/schemas";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { HiddenFields } from "@/components/teacher/HiddenFields";
import { ActionButton } from "@/components/ui/Button";
import { idleFormState, type FormState } from "@/lib/forms/form-state";
import { saveQuestionAction } from "@/lib/quizzes/quiz-actions";
import { QuestionKindFields } from "./QuestionKindFields";
import { questionKindLabels } from "./question-defaults";

interface QuestionEditorProps {
  quizId: string;
  question?: Question;
}

const kindEntries = Object.entries(questionKindLabels) as [Question["kind"], string][];

export function QuestionEditor({ quizId, question }: QuestionEditorProps) {
  const [kind, setKind] = useState<Question["kind"]>(question?.kind ?? "single-choice");
  const [state, setState] = useState<FormState>(idleFormState);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      setState(await saveQuestionAction(idleFormState, formData));
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <HiddenFields fields={{ quizId, questionId: question?.id ?? "" }} />
      {question ? (
        <input type="hidden" name="kind" value={question.kind} />
      ) : (
        <div>
          <label htmlFor={`${quizId}-new-kind`} className="block text-sm font-medium text-foreground">
            Tipo de pregunta
          </label>
          <select
            id={`${quizId}-new-kind`}
            name="kind"
            value={kind}
            onChange={(event) => setKind(event.target.value as Question["kind"])}
            className="mt-2 h-12 w-full rounded-sm border border-line bg-surface px-4 text-base text-foreground transition-colors focus:border-primary"
          >
            {kindEntries.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}
      <TextAreaField label="Enunciado" name="prompt" defaultValue={question?.prompt} rows={3} required />
      <QuestionKindFields key={kind} kind={kind} question={question} />
      <TextAreaField
        label="Explicación"
        name="explanation"
        defaultValue={question?.explanation}
        rows={3}
        required
        hint="El alumno la ve al revisar sus respuestas, después de entregar."
      />
      <FormStateMessage state={state} />
      <ActionButton type="submit" size="sm" disabled={isPending}>
        {isPending ? "Guardando…" : question ? "Guardar pregunta" : "Agregar pregunta"}
      </ActionButton>
    </form>
  );
}
