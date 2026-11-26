import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { LevelIndex } from "./LevelIndex";

export function Hero() {
  return (
    <section className="surface-dark bg-navy text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-10 md:px-8 md:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <Reveal>
          <p className="text-sm font-medium text-cyan">Instituto Generación IA</p>
          <h1 className="mt-2 font-heading text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            Campus virtual de inteligencia artificial
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
            Cursos de inteligencia artificial para niños y adultos, organizados en niveles,
            módulos y clases.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/campus" variant="inverse">
              Acceder al campus
            </Button>
            <Button href="#niveles" variant="outlineOnDark">
              Ver niveles
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <LevelIndex />
        </Reveal>
      </div>
    </section>
  );
}
