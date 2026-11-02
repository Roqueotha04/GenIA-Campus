import type { CourseModule, Level } from "@/data/schemas";
import { buildModuleSections } from "@/lib/module-resources";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "./Breadcrumb";
import { EmptyModule } from "./EmptyModule";
import { ResourceList } from "./ResourceList";

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

  const accordionItems: AccordionItem[] = buildModuleSections(level, courseModule).map(
    (section) => ({
      id: `${level.slug}-${number}-${section.id}`,
      title: section.title,
      content: <ResourceList resources={section.resources} emptyMessage={section.emptyMessage} />,
    }),
  );

  return (
    <Section>
      <Breadcrumb items={breadcrumbItems} />
      <Reveal>
        <SectionHeading level={1} eyebrow={level.name} title={`Módulo ${number}`} />
      </Reveal>
      <Reveal delay={0.1} className="mt-10">
        <Accordion items={accordionItems} defaultOpenIds={accordionItems.map((item) => item.id)} />
      </Reveal>
    </Section>
  );
}
