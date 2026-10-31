import type { Level } from "@/data/schemas";
import { countModulesWithClasses } from "@/lib/catalog";
import { Carousel } from "@/components/ui/Carousel";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "./Breadcrumb";
import { ModuleCard } from "./ModuleCard";

export function LevelView({ level }: { level: Level }) {
  const isEmpty = countModulesWithClasses(level) === 0;

  return (
    <Section>
      <Breadcrumb items={[{ label: "Campus", href: "/campus" }, { label: level.name }]} />
      <Reveal>
        <SectionHeading
          level={1}
          eyebrow="Nivel"
          title={level.name}
          accent="Elegí tu módulo."
          subtitle={
            isEmpty ? "Todavía no hay contenido cargado en este nivel." : level.description
          }
        />
      </Reveal>
      <Reveal delay={0.1} className="mt-12">
        <Carousel columns={3}>
          {level.modules.map((courseModule) => (
            <ModuleCard
              key={courseModule.number}
              levelSlug={level.slug}
              courseModule={courseModule}
            />
          ))}
        </Carousel>
      </Reveal>
    </Section>
  );
}
