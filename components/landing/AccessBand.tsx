import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AccessBand() {
  return (
    <Section className="surface-dark bg-navy-deep">
      <Reveal className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          tone="onDark"
          title="¿Ya tenés tu cuenta?"
          accent="Entrá y seguí donde lo dejaste."
        />
        <Button href="/acceso" variant="inverse">
          Acceder al campus
        </Button>
      </Reveal>
    </Section>
  );
}
