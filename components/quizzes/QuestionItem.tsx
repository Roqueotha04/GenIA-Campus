import type { Question } from "@/data/schemas";
import { ConfirmActionForm } from "@/components/teacher/ConfirmActionForm";
import { MoveControls } from "@/components/teacher/MoveControls";
import { deleteQuestionAction, moveQuestionAction } from "@/lib/quizzes/quiz-actions";
import { QuestionEditor } from "./QuestionEditor";
import { questionKindLabels } from "./question-defaults";

interface QuestionItemProps {
  quizId: string;
  question: Question;
  number: number;
  isFirst: boolean;
  isLast: boolean;
}

export function QuestionItem({ quizId, question, number, isFirst, isLast }: QuestionItemProps) {
  const hiddenFields = { quizId, questionId: question.id };

  return (
    <li className="border border-line bg-surface p-4 md:p-6">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted">
        {String(number).padStart(2, "0")} · {questionKindLabels[question.kind]}
      </p>
      <p className="mt-2 break-words font-medium text-foreground">{question.prompt}</p>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <MoveControls
          action={moveQuestionAction}
          hiddenFields={hiddenFields}
          isFirst={isFirst}
          isLast={isLast}
          itemLabel={`pregunta ${number}`}
        />
        <ConfirmActionForm
          action={deleteQuestionAction}
          hiddenFields={hiddenFields}
          label="Eliminar"
          confirmLabel="Sí, eliminar"
          pendingLabel="Eliminando…"
        />
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-primary">Editar pregunta</summary>
        <div className="mt-4">
          <QuestionEditor quizId={quizId} question={question} />
        </div>
      </details>
    </li>
  );
}
