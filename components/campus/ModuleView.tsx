import type { CourseModule, Level } from "@/data/schemas";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "./Breadcrumb";
import { ClassCard } from "./ClassCard";
import { EmptyModule } from "./EmptyModule";

interface ModuleViewProps {
  level: Level;
  courseModule: CourseModule;
}

export function ModuleView({ level, courseModule }: ModuleViewProps) {
  const { number, classes } = courseModule;
  const breadcrumbItems = [
    { label: "Campus", href: "/campus" },
    { label: level.name, href: `/campus/${level.slug}` },
    { label: `Módulo ${number}` },
  ];

  if (!classes || classes.length === 0) {
    return (
      <Section>
        <Breadcrumb items={breadcrumbItems} />
        <EmptyModule levelSlug={level.slug} levelName={level.name} moduleNumber={number} />
      </Section>
    );
  }

  return (
    <Section>
      <Breadcrumb items={breadcrumbItems} />
      <Reveal>
        <SectionHeading
          level={1}
          eyebrow={level.name}
          title={`Módulo ${number}`}
          accent="Elegí tu clase."
        />
      </Reveal>
      <Reveal delay={0.1} className="mt-12 flex flex-col gap-4">
        {classes.map((courseClass) => (
          <ClassCard
            key={courseClass.number}
            href={`/campus/${level.slug}/${number}/${courseClass.number}`}
            courseClass={courseClass}
          />
        ))}
      </Reveal>
    </Section>
  );
}
