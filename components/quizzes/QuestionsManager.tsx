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
      <SectionHeading title="Preguntas" eyebrow="Contenido" />
      {questions.length === 0 ? (
        <p className="mt-8 text-muted">
          Todavía no hay preguntas. Agregá la primera para poder publicar el cuestionario.
        </p>
      ) : (
        <ol className="mt-8 space-y-4">
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
      <div className="mt-8 border border-line bg-surface p-5 md:p-8">
        <p className="mb-4 font-medium text-foreground">Nueva pregunta</p>
        <QuestionEditor key={questions.length} quizId={quizId} />
      </div>
    </div>
  );
}
