import { Breadcrumb } from "@/components/campus/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildCourseHref, type CourseSummary } from "@/lib/courses/course-access";
import { buildQuizManagerHref } from "@/lib/quizzes/quiz-routes";
import type { CourseManagementData } from "@/lib/teacher/load-course-management";
import { EnrollmentKeyPanel } from "./EnrollmentKeyPanel";
import { NoticesManager } from "./NoticesManager";
import { SectionsManager } from "./SectionsManager";

interface CourseManagementProps {
  course: CourseSummary;
  data: CourseManagementData;
}

export function CourseManagement({ course, data }: CourseManagementProps) {
  const courseHref = buildCourseHref(course);

  return (
    <Section>
      <Breadcrumb
        items={[
          { label: "Campus", href: "/campus" },
          { label: course.title, href: courseHref },
          { label: "Gestionar" },
        ]}
      />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeading level={1} title="Gestionar curso" eyebrow={course.title} />
        <div className="flex flex-wrap gap-3">
          <Button href={buildQuizManagerHref(course)} variant="outline" size="sm">
            Cuestionarios
          </Button>
          <Button href={courseHref} variant="outline" size="sm">
            Ver como alumno
          </Button>
        </div>
      </div>
      <div className="mt-8 space-y-10">
        <EnrollmentKeyPanel courseId={course.id} enrollmentKey={data.enrollmentKey} />
        <SectionsManager courseId={course.id} sections={data.sections} />
        <NoticesManager courseId={course.id} notices={data.notices} />
      </div>
    </Section>
  );
}
