import type { Level } from "@/data/schemas";
import { countModulesWithClasses } from "@/lib/catalog";
import { Carousel } from "@/components/ui/Carousel";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ModuleAvailability } from "@/lib/course-content/course-content-types";
import { Breadcrumb } from "./Breadcrumb";
import { ModuleCard } from "./ModuleCard";

interface LevelViewProps {
  level: Level;
  availability: Record<number, ModuleAvailability>;
}

export function LevelView({ level, availability }: LevelViewProps) {
  const isEmpty =
    countModulesWithClasses(level) === 0 && Object.keys(availability).length === 0;

  return (
    <Section>
      <Breadcrumb items={[{ label: "Campus", href: "/campus" }, { label: level.name }]} />
      <Reveal>
        <SectionHeading
          level={1}
          title={level.name}
          subtitle={
            isEmpty ? "Todavía no hay contenido en este nivel. Aparece acá cuando el docente lo publique." : level.description
          }
        />
      </Reveal>
      <Reveal delay={0.1} className="mt-6">
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
