"use client";

import { Carousel } from "@/components/ui/Carousel";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { levels } from "@/data/levels";
import { useSession } from "@/hooks/useSession";
import { LevelCard } from "./LevelCard";

export function CampusHome() {
  const { user } = useSession();

  return (
    <Section>
      <Reveal>
        <SectionHeading
          level={1}
          eyebrow="Campus"
          title={user ? `Hola, ${user.name}` : "Hola"}
          accent="¿Por dónde seguimos?"
          subtitle="Elegí tu nivel para ver sus módulos, presentaciones y actividades."
        />
      </Reveal>
      <Reveal delay={0.1} className="mt-12">
        <Carousel columns={4}>
          {levels.map((level) => (
            <LevelCard key={level.slug} level={level} />
          ))}
        </Carousel>
      </Reveal>
    </Section>
  );
}
