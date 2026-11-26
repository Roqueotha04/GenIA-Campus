import type { CourseModule, Level } from "@/data/schemas";
import { buildModuleBreadcrumbItems } from "@/lib/breadcrumbs";
import { buildModuleHref } from "@/lib/catalog";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "./Breadcrumb";
import { NoticeBoard } from "./NoticeBoard";

interface NoticesViewProps {
  level: Level;
  courseModule: CourseModule;
}

export function NoticesView({ level, courseModule }: NoticesViewProps) {
  return (
    <Section>
      <Breadcrumb items={buildModuleBreadcrumbItems(level, courseModule, "Avisos")} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          level={1}
          eyebrow={`${level.name} · Módulo ${courseModule.number}`}
          title="Avisos"
          subtitle="Novedades que publica el docente para este módulo."
        />
        <Button href={buildModuleHref(level, courseModule)} variant="outline" size="sm">
          <ArrowLeftIcon className="h-4 w-4" />
          Volver al módulo
        </Button>
      </div>
      <Reveal delay={0.1} className="mt-6">
        <NoticeBoard notices={courseModule.notices ?? []} />
      </Reveal>
    </Section>
  );
}
