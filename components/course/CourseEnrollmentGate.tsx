import type { CourseSummary } from "@/lib/courses/course-access";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CourseBreadcrumb } from "./CourseBreadcrumb";
import { EnrollmentForm } from "./EnrollmentForm";

interface CourseEnrollmentGateProps {
  course: CourseSummary;
  levelName: string;
  teacherNames: string[];
}

export function CourseEnrollmentGate({ course, levelName, teacherNames }: CourseEnrollmentGateProps) {
  return (
    <Section>
      <CourseBreadcrumb course={course} levelName={levelName} />
      <Reveal>
        <SectionHeading
          level={1}
          eyebrow={`${levelName} · Módulo ${course.module_number}`}
          title={course.title}
          subtitle={course.description || undefined}
        />
        {teacherNames.length > 0 && (
          <p className="mt-6 text-sm text-muted">
            {teacherNames.length === 1 ? "Docente" : "Docentes"}:{" "}
            <span className="text-foreground">{teacherNames.join(", ")}</span>
          </p>
        )}
      </Reveal>
      <Reveal delay={0.1} className="mt-12 border border-line bg-surface p-6 md:p-10">
        <EnrollmentForm courseId={course.id} />
      </Reveal>
    </Section>
  );
}
