import type { Question } from "@/data/schemas";
import { Breadcrumb } from "@/components/campus/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusDot } from "@/components/ui/StatusDot";
import { buildCourseManageHref, buildCourseQuizHref } from "@/lib/course-content/course-routes";
import { buildCourseHref, type CourseSummary } from "@/lib/courses/course-access";
import type { StudentAttemptSummary } from "@/lib/quizzes/quiz-attempt-summaries";
import { buildQuizManagerHref } from "@/lib/quizzes/quiz-routes";
import type { StoredQuiz } from "@/lib/quizzes/stored-quiz";
import { QuestionsManager } from "./QuestionsManager";
import { QuizAttemptsTable } from "./QuizAttemptsTable";
import { QuizPublishForm } from "./QuizPublishForm";
import { QuizSettingsForm } from "./QuizSettingsForm";

interface QuizEditorViewProps {
  course: CourseSummary;
  quiz: StoredQuiz;
  questions: Question[];
  summaries: StudentAttemptSummary[];
}

export function QuizEditorView({ course, quiz, questions, summaries }: QuizEditorViewProps) {
  return (
    <Section>
      <Breadcrumb
        items={[
          { label: "Campus", href: "/campus" },
          { label: course.title, href: buildCourseHref(course) },
          { label: "Gestionar", href: buildCourseManageHref(course) },
          { label: "Cuestionarios", href: buildQuizManagerHref(course) },
          { label: quiz.title },
        ]}
      />
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading level={1} title={quiz.title} eyebrow="Editar cuestionario" subtitle={course.title} />
        <div className="flex flex-wrap items-start gap-3">
          <Button href={buildCourseQuizHref(course, quiz.id)} variant="outline" size="sm">
            Probar como alumno
          </Button>
          <QuizPublishForm quizId={quiz.id} isPublished={quiz.is_published} />
        </div>
      </div>
      <p className="mt-6 flex items-center gap-2 text-sm text-muted">
        <StatusDot tone={quiz.is_published ? "available" : "empty"} />
        {quiz.is_published
          ? "Publicado: los alumnos pueden rendirlo cuando lo sumes a una sección."
          : "Borrador: los alumnos no lo ven hasta que lo publiques."}
      </p>
      <div className="mt-12 space-y-16">
        <div>
          <SectionHeading title="Datos generales" eyebrow="Configuración" />
          <div className="mt-8 border border-line bg-surface p-5 md:p-8">
            <QuizSettingsForm quiz={quiz} questionCount={questions.length} />
          </div>
        </div>
        <QuestionsManager quizId={quiz.id} questions={questions} />
        <QuizAttemptsTable summaries={summaries} passingScore={quiz.passing_score} />
      </div>
    </Section>
  );
}
