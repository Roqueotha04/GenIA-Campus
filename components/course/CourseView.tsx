import type {
  CourseNoticeItem,
  CourseSectionContent as CourseSectionData,
} from "@/lib/course-content/course-content-types";
import { buildCourseNoticesHref, buildCourseManageHref } from "@/lib/course-content/course-routes";
import type { CourseSummary } from "@/lib/courses/course-access";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CourseBreadcrumb } from "./CourseBreadcrumb";
import { CourseLiveUpdates } from "./CourseLiveUpdates";
import { CourseNoticesPreview } from "./CourseNoticesPreview";
import { CourseSectionContent } from "./CourseSectionContent";

interface CourseViewProps {
  course: CourseSummary;
  levelName: string;
  canManage: boolean;
  sections: CourseSectionData[];
  recentNotices: CourseNoticeItem[];
}

function EmptyCourse() {
  return (
    <div className="border border-line bg-surface p-8 md:p-12">
      <p className="font-heading text-xl font-semibold tracking-tight text-foreground">
        Todavía no hay material
      </p>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Tu docente todavía no cargó material. Cuando lo haga, aparece acá al instante.
      </p>
    </div>
  );
}

export function CourseView({ course, levelName, canManage, sections, recentNotices }: CourseViewProps) {
  const accordionItems: AccordionItem[] = sections.map((section) => ({
    id: section.id,
    title: section.title,
    content: <CourseSectionContent section={section} />,
  }));

  return (
    <Section>
      <CourseBreadcrumb course={course} levelName={levelName} />
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            level={1}
            eyebrow={`${levelName} · Módulo ${course.module_number}`}
            title={course.title}
            subtitle={course.description || undefined}
          />
          {canManage && (
            <Button href={buildCourseManageHref(course)} variant="outline" size="sm">
              Gestionar curso
            </Button>
          )}
        </div>
      </Reveal>
      <Reveal delay={0.1} className="mt-10">
        {sections.length === 0 ? (
          <EmptyCourse />
        ) : (
          <Accordion items={accordionItems} defaultOpenIds={accordionItems.map((item) => item.id)} />
        )}
      </Reveal>
      <Reveal delay={0.15} className="mt-14">
        <CourseNoticesPreview notices={recentNotices} noticesHref={buildCourseNoticesHref(course)} />
      </Reveal>
      <CourseLiveUpdates courseId={course.id} />
    </Section>
  );
}
