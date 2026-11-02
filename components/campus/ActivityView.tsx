import type { Activity, CourseClass, CourseModule, Level } from "@/data/schemas";
import { buildModuleBreadcrumbItems } from "@/lib/breadcrumbs";
import { buildModuleHref } from "@/lib/catalog";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ActivityPanel } from "./ActivityPanel";
import { Breadcrumb } from "./Breadcrumb";
import { TeacherResultsPanel } from "./TeacherResultsPanel";

interface ActivityViewProps {
  level: Level;
  courseModule: CourseModule;
  courseClass: CourseClass;
  activity: Activity;
}

export function ActivityView({ level, courseModule, courseClass, activity }: ActivityViewProps) {
  return (
    <>
      <Section className="py-8 md:py-12">
        <Breadcrumb items={buildModuleBreadcrumbItems(level, courseModule, activity.title)} />
        <SectionHeading
          level={1}
          eyebrow="Cuestionario"
          title={activity.title}
          subtitle={courseClass.title}
        />
        <div className="mt-12">
          <ActivityPanel activity={activity} moduleHref={buildModuleHref(level, courseModule)} />
        </div>
      </Section>
      <TeacherResultsPanel activity={activity} />
    </>
  );
}
