import { ActionForm } from "@/components/teacher/ActionForm";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import { updateQuizAction } from "@/lib/quizzes/quiz-actions";
import type { StoredQuiz } from "@/lib/quizzes/stored-quiz";

interface QuizSettingsFormProps {
  quiz: Pick<StoredQuiz, "id" | "title" | "description" | "passing_score">;
  questionCount: number;
}

export function QuizSettingsForm({ quiz, questionCount }: QuizSettingsFormProps) {
  const passingHint =
    questionCount > 0
      ? `Cantidad de respuestas correctas para aprobar, entre 1 y ${questionCount}.`
      : "Cantidad de respuestas correctas para aprobar. Se ajusta a la cantidad de preguntas que cargues.";

  return (
    <ActionForm
      action={updateQuizAction}
      hiddenFields={{ quizId: quiz.id }}
      submitLabel="Guardar datos"
      pendingLabel="Guardando…"
    >
      <TextField label="Título" name="title" defaultValue={quiz.title} required />
      <TextAreaField label="Descripción" name="description" defaultValue={quiz.description} rows={3} />
      <TextField
        label="Nota de aprobación"
        name="passingScore"
        type="number"
        defaultValue={String(quiz.passing_score)}
        hint={passingHint}
        required
      />
    </ActionForm>
  );
}
