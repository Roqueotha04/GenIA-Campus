import { ConfirmActionForm } from "@/components/teacher/ConfirmActionForm";
import { Button } from "@/components/ui/Button";
import { StatusDot } from "@/components/ui/StatusDot";
import type { CourseSummary } from "@/lib/courses/course-access";
import { deleteQuizAction } from "@/lib/quizzes/quiz-actions";
import { buildQuizEditorHref } from "@/lib/quizzes/quiz-routes";
import type { StoredQuiz } from "@/lib/quizzes/stored-quiz";
import { QuizPublishForm } from "./QuizPublishForm";

interface QuizListItemProps {
  course: CourseSummary;
  quiz: StoredQuiz;
  questionCount: number;
}

export function QuizListItem({ course, quiz, questionCount }: QuizListItemProps) {
  return (
    <li className="border border-line bg-surface p-4">
      <p className="flex items-center gap-2 text-xs text-muted">
        <StatusDot tone={quiz.is_published ? "available" : "empty"} />
        {quiz.is_published ? "Publicado" : "Borrador"}
      </p>
      <p className="mt-1 break-words font-medium text-foreground">{quiz.title}</p>
      <p className="mt-1 text-sm text-muted">
        {questionCount} {questionCount === 1 ? "pregunta" : "preguntas"} · Aprobás con {quiz.passing_score}
      </p>

      <div className="mt-3 flex flex-wrap items-start gap-3">
        <Button href={buildQuizEditorHref(course, quiz.id)} variant="outline" size="sm">
          Editar y ver resultados
        </Button>
        <QuizPublishForm quizId={quiz.id} isPublished={quiz.is_published} />
        <ConfirmActionForm
          action={deleteQuizAction}
          hiddenFields={{ quizId: quiz.id }}
          label="Eliminar"
          confirmLabel="Sí, eliminar"
          pendingLabel="Eliminando…"
          warning="También se borran los intentos de los alumnos y el recurso en las secciones."
        />
      </div>
    </li>
  );
}
