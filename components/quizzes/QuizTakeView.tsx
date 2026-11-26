import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CourseBreadcrumb } from "@/components/course/CourseBreadcrumb";
import { buildCourseHref, type CourseSummary } from "@/lib/courses/course-access";
import type { QuizForTaking } from "@/lib/quizzes/load-quiz-for-taking";
import { QuizTaker } from "./QuizTaker";

interface QuizTakeViewProps {
  course: CourseSummary;
  levelName: string;
  quizId: string;
  quiz: QuizForTaking;
  previewNotice: string | null;
}

export function QuizTakeView({ course, levelName, quizId, quiz, previewNotice }: QuizTakeViewProps) {
  const moduleHref = buildCourseHref(course);

  return (
    <Section className="py-8 md:py-12">
      <CourseBreadcrumb course={course} levelName={levelName} currentLabel={quiz.title} />
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading level={1} eyebrow="Cuestionario" title={quiz.title} subtitle={course.title} />
        <Button href={moduleHref} variant="outline" size="sm">
          <ArrowLeftIcon className="h-4 w-4" />
          Volver al módulo
        </Button>
      </div>
      <div className="mt-12">
        {quiz.questions.length === 0 ? (
          <p className="text-muted">
            Este cuestionario todavía no tiene preguntas. Va a estar disponible cuando tu docente las cargue.
          </p>
        ) : (
          <QuizTaker
            quizId={quizId}
            title={quiz.title}
            description={quiz.description}
            passingScore={quiz.passingScore}
            questions={quiz.questions}
            initialReview={quiz.initialReview}
            previewNotice={previewNotice}
            moduleHref={moduleHref}
          />
        )}
      </div>
    </Section>
  );
}
