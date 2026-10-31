import { Carousel } from "@/components/ui/Carousel";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Ingresás",
    description: "Entrá con el email y la clave que te dio tu docente.",
  },
  {
    number: "02",
    title: "Elegís nivel y módulo",
    description: "Cada nivel reúne sus módulos con presentaciones y material de clase.",
  },
  {
    number: "03",
    title: "Practicás",
    description: "Resolvé la actividad del módulo y mirá tu puntaje al instante.",
  },
];

export function HowItWorks() {
  return (
    <Section id="como-funciona">
      <Reveal>
        <SectionHeading
          eyebrow="Cómo funciona"
          title="Del ingreso a la actividad"
          accent="en tres pasos."
        />
      </Reveal>
      <Reveal delay={0.1} className="mt-12">
        <Carousel columns={3}>
          {steps.map((step) => (
            <article key={step.number} className="border border-line bg-surface p-6 md:p-8">
              <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-primary" />
              <p className="mt-8 text-xs tracking-[0.2em] text-muted">{step.number}</p>
              <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>
            </article>
          ))}
        </Carousel>
      </Reveal>
    </Section>
  );
}
