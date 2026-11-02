import { levels } from "@/data/levels";
import type { Level } from "@/data/schemas";
import { formatModuleCount } from "@/lib/catalog";
import { levelAccentBackground } from "@/lib/level-accent";
import { Carousel } from "@/components/ui/Carousel";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

function listTopics(level: Level) {
  return level.modules.flatMap((courseModule) =>
    (courseModule.classes ?? []).map((courseClass) => ({
      key: `${courseModule.number}-${courseClass.number}`,
      moduleNumber: courseModule.number,
      title: courseClass.title,
    })),
  );
}

export function LevelCatalog() {
  return (
    <Section id="niveles">
      <Reveal>
        <SectionHeading
          eyebrow="Plan de estudio"
          title="Niveles, módulos"
          accent="y temas."
        />
      </Reveal>
      <Reveal delay={0.1} className="mt-12">
        <Carousel columns={4}>
          {levels.map((level) => {
            const topics = listTopics(level);
            return (
              <article key={level.slug} className="flex flex-col border border-line bg-surface">
                <span
                  aria-hidden
                  className={`block h-1 w-full ${levelAccentBackground[level.accent]}`}
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-muted">
                    {formatModuleCount(level.modules.length)}
                  </p>
                  <h3 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground">
                    {level.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{level.description}</p>
                  <div className="mt-6 border-t border-line pt-5">
                    {topics.length > 0 ? (
                      <ul className="flex flex-col gap-3 text-sm text-foreground">
                        {topics.map((topic) => (
                          <li key={topic.key}>
                            <span className="block text-xs text-muted">
                              Módulo {topic.moduleNumber}
                            </span>
                            {topic.title}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted">
                        Los temas se publican a medida que se cargan las clases.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </Carousel>
      </Reveal>
    </Section>
  );
}
