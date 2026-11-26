import { Breadcrumb } from "@/components/campus/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildCourseManageHref } from "@/lib/course-content/course-routes";
import { buildCourseHref, type CourseSummary } from "@/lib/courses/course-access";
import { parseStoredQuestions, type StoredQuiz } from "@/lib/quizzes/stored-quiz";
import { QuizCreateForm } from "./QuizCreateForm";
import { QuizListItem } from "./QuizListItem";

interface QuizManagerViewProps {
  course: CourseSummary;
  quizzes: StoredQuiz[];
}

export function QuizManagerView({ course, quizzes }: QuizManagerViewProps) {
  const manageHref = buildCourseManageHref(course);

  return (
    <Section>
      <Breadcrumb
        items={[
          { label: "Campus", href: "/campus" },
          { label: course.title, href: buildCourseHref(course) },
          { label: "Gestionar", href: manageHref },
          { label: "Cuestionarios" },
        ]}
      />
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading level={1} title="Cuestionarios" eyebrow={course.title} />
        <Button href={manageHref} variant="outline" size="sm">
          Volver a gestionar el curso
        </Button>
      </div>
      <div className="mt-12 space-y-12">
        {quizzes.length === 0 ? (
          <p className="text-muted">
            Todavía no hay cuestionarios. Creá el primero, cargale preguntas y publicalo para sumarlo a una sección.
          </p>
        ) : (
          <ul className="space-y-4">
            {quizzes.map((quiz) => (
              <QuizListItem
                key={quiz.id}
                course={course}
                quiz={quiz}
                questionCount={parseStoredQuestions(quiz.questions)?.length ?? 0}
              />
            ))}
          </ul>
        )}
        <div className="border border-line bg-surface p-5 md:p-8">
          <p className="mb-4 font-medium text-foreground">Nuevo cuestionario</p>
          <QuizCreateForm courseId={course.id} />
        </div>
      </div>
    </Section>
  );
}
