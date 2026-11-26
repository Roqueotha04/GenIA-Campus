import { ActionForm } from "@/components/teacher/ActionForm";
import { TextField } from "@/components/ui/TextField";
import { createQuizAction } from "@/lib/quizzes/quiz-actions";

export function QuizCreateForm({ courseId }: { courseId: string }) {
  return (
    <ActionForm
      action={createQuizAction}
      hiddenFields={{ courseId }}
      submitLabel="Crear cuestionario"
      pendingLabel="Creando…"
    >
      <TextField label="Título" name="title" required />
    </ActionForm>
  );
}
