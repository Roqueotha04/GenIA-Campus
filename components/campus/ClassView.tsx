import type { CourseClass, CourseModule, Level } from "@/data/schemas";
import { formatNumber } from "@/lib/catalog";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ActivityPanel } from "./ActivityPanel";
import { Breadcrumb } from "./Breadcrumb";
import { GameEmbed } from "./GameEmbed";
import { PresentationViewer } from "./PresentationViewer";
import { SummaryDownload } from "./SummaryDownload";
import { TeacherResultsPanel } from "./TeacherResultsPanel";

interface ClassViewProps {
  level: Level;
  courseModule: CourseModule;
  courseClass: CourseClass;
}

export function ClassView({ level, courseModule, courseClass }: ClassViewProps) {
  const { presentationPdf, summaryDocument, activity, game } = courseClass;
  const breadcrumbItems = [
    { label: "Campus", href: "/campus" },
    { label: level.name, href: `/campus/${level.slug}` },
    { label: `Módulo ${courseModule.number}`, href: `/campus/${level.slug}/${courseModule.number}` },
    { label: `Clase ${courseClass.number}` },
  ];

  return (
    <>
      <Section className="pb-8 md:pb-12">
        <Breadcrumb items={breadcrumbItems} />
        <Reveal>
          <SectionHeading
            level={1}
            eyebrow={`${level.name} · Módulo ${courseModule.number} · Clase ${formatNumber(courseClass.number)}`}
            title={courseClass.title}
            subtitle={courseClass.summary}
          />
        </Reveal>
      </Section>
      {game && (
        <Section className="py-8 md:py-12">
          <Reveal>
            <GameEmbed game={game} />
          </Reveal>
        </Section>
      )}
      {presentationPdf && (
        <Section className="py-8 md:py-12">
          <Reveal>
            <PresentationViewer pdfPath={presentationPdf} />
          </Reveal>
        </Section>
      )}
      {summaryDocument && (
        <Section className="py-8 md:py-12">
          <Reveal>
            <SummaryDownload document={summaryDocument} />
          </Reveal>
        </Section>
      )}
      {activity && (
        <Section className="py-8 md:py-12">
          <Reveal>
            <ActivityPanel activity={activity} />
          </Reveal>
        </Section>
      )}
      {activity && <TeacherResultsPanel activity={activity} />}
    </>
  );
}
