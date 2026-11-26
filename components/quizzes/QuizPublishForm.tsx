"use client";

import { useActionState } from "react";
import { HiddenFields } from "@/components/teacher/HiddenFields";
import { FormStateMessage } from "@/components/ui/FormStateMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { idleFormState } from "@/lib/forms/form-state";
import { setQuizPublishedAction } from "@/lib/quizzes/quiz-actions";

interface QuizPublishFormProps {
  quizId: string;
  isPublished: boolean;
}

export function QuizPublishForm({ quizId, isPublished }: QuizPublishFormProps) {
  const [state, formAction] = useActionState(setQuizPublishedAction, idleFormState);

  return (
    <form action={formAction} className="space-y-3">
      <HiddenFields fields={{ quizId, publish: isPublished ? "false" : "true" }} />
      <SubmitButton pendingLabel="Guardando…" variant={isPublished ? "outline" : "primary"} size="sm">
        {isPublished ? "Despublicar" : "Publicar"}
      </SubmitButton>
      <FormStateMessage state={state} />
    </form>
  );
}
