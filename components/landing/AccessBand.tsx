import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AccessBand() {
  return (
    <Section className="surface-dark bg-navy-deep">
      <Reveal className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <SectionHeading
          tone="onDark"
          title="Acceso al campus"
          subtitle="Entrá para ver tus cursos, materiales y actividades."
        />
        <Button href="/campus" variant="inverse">
          Acceder al campus
        </Button>
      </Reveal>
    </Section>
  );
}
