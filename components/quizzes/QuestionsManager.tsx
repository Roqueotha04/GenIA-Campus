import type { Question } from "@/data/schemas";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QuestionEditor } from "./QuestionEditor";
import { QuestionItem } from "./QuestionItem";

interface QuestionsManagerProps {
  quizId: string;
  questions: Question[];
}

export function QuestionsManager({ quizId, questions }: QuestionsManagerProps) {
  return (
    <div>
      <SectionHeading title="Preguntas" />
      {questions.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          Todavía no hay preguntas. Agregá la primera para poder publicar el cuestionario.
        </p>
      ) : (
        <ol className="mt-3 space-y-2">
          {questions.map((question, index) => (
            <QuestionItem
              key={question.id}
              quizId={quizId}
              question={question}
              number={index + 1}
              isFirst={index === 0}
              isLast={index === questions.length - 1}
            />
          ))}
        </ol>
      )}
      <div className="mt-4 border border-line bg-surface p-4 md:p-5">
        <p className="mb-3 text-sm font-semibold text-foreground">Nueva pregunta</p>
        <QuestionEditor key={questions.length} quizId={quizId} />
      </div>
    </div>
  );
}
