import type { CourseNoticeItem } from "@/lib/course-content/course-content-types";
import { buildCourseHref, type CourseSummary } from "@/lib/courses/course-access";
import { NoticeBoard } from "@/components/campus/NoticeBoard";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CourseBreadcrumb } from "./CourseBreadcrumb";
import { CourseLiveUpdates } from "./CourseLiveUpdates";

interface CourseNoticesViewProps {
  course: CourseSummary;
  levelName: string;
  notices: CourseNoticeItem[];
}

export function CourseNoticesView({ course, levelName, notices }: CourseNoticesViewProps) {
  return (
    <Section>
      <CourseBreadcrumb course={course} levelName={levelName} currentLabel="Avisos" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          level={1}
          eyebrow={`${levelName} · Módulo ${course.module_number}`}
          title="Avisos"
          subtitle="Novedades que publica el docente para este módulo."
        />
        <Button href={buildCourseHref(course)} variant="outline" size="sm">
          <ArrowLeftIcon className="h-4 w-4" />
          Volver al módulo
        </Button>
      </div>
      <Reveal delay={0.1} className="mt-6">
        <NoticeBoard
          notices={notices.map((notice) => ({
            title: notice.title,
            author: notice.authorName ?? "Docente",
            date: notice.createdLabel,
            message: notice.body,
          }))}
        />
      </Reveal>
      <CourseLiveUpdates courseId={course.id} />
    </Section>
  );
}
