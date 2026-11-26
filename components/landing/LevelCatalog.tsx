import { levelsWithFeaturedFirst } from "@/lib/catalog";
import { levelAccentBackground } from "@/lib/level-accent";
import { Carousel } from "@/components/ui/Carousel";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LevelTopics } from "./LevelTopics";

export function LevelCatalog() {
  return (
    <Section id="niveles">
      <Reveal>
        <SectionHeading
          title="Niveles y temas"
          subtitle="Cada nivel se organiza en módulos. Estos son los temas publicados hasta ahora."
        />
      </Reveal>
      <Reveal delay={0.1} className="mt-6">
        <Carousel columns={4}>
          {levelsWithFeaturedFirst.map((level) => (
            <article key={level.slug} className="flex flex-col rounded-sm border border-line bg-surface">
              <span
                aria-hidden
                className={`block h-1 w-full ${levelAccentBackground[level.accent]}`}
              />
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-heading text-lg font-semibold text-foreground">{level.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{level.description}</p>
                <div className="mt-4 border-t border-line pt-4">
                  <LevelTopics level={level} />
                </div>
              </div>
            </article>
          ))}
        </Carousel>
      </Reveal>
    </Section>
  );
}
