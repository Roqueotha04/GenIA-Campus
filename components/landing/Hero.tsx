import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { LevelIndex } from "./LevelIndex";

export function Hero() {
  return (
    <section className="surface-dark bg-navy text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 pb-16 pt-14 md:px-8 md:pb-24 md:pt-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <Reveal>
          <div className="text-cyan">
            <Eyebrow>Instituto Generación IA</Eyebrow>
          </div>
          <h1 className="mt-6 font-heading text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Campus virtual
            <span className="mt-3 block font-accent text-3xl font-normal italic tracking-normal text-cyan md:text-5xl">
              de inteligencia artificial.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Cursos de inteligencia artificial para niños y adultos, organizados en niveles,
            módulos y clases.
            {/* Ingresá con el usuario que te dio tu docente. */}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {/* <Button href="/acceso" variant="inverse"> */}
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
