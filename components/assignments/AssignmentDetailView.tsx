import type { ReactNode } from "react";
import { CourseBreadcrumb } from "@/components/course/CourseBreadcrumb";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { AssignmentRecord } from "@/lib/assignments/assignment-types";
import { buildCourseHref, type CourseSummary } from "@/lib/courses/course-access";
import { AssignmentBrief } from "./AssignmentBrief";

interface AssignmentDetailViewProps {
  course: CourseSummary;
  levelName: string;
  assignment: AssignmentRecord;
  attachmentUrl: string | null;
  children: ReactNode;
}

export function AssignmentDetailView({
  course,
  levelName,
  assignment,
  attachmentUrl,
  children,
}: AssignmentDetailViewProps) {
  return (
    <Section className="py-8 md:py-12">
      <CourseBreadcrumb course={course} levelName={levelName} currentLabel={assignment.title} />
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          level={1}
          eyebrow={`${levelName} · Módulo ${course.module_number}`}
          title={assignment.title}
        />
        <Button href={buildCourseHref(course)} variant="outline" size="sm">
          <ArrowLeftIcon className="h-4 w-4" />
          Volver al módulo
        </Button>
      </div>
      <div className="mt-10 space-y-10">
        <AssignmentBrief assignment={assignment} attachmentUrl={attachmentUrl} />
        {children}
      </div>
    </Section>
  );
}
