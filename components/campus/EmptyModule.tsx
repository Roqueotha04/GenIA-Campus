import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLeftIcon } from "@/components/ui/icons";

interface EmptyModuleProps {
  levelSlug: string;
  levelName: string;
  moduleNumber: number;
}

export function EmptyModule({ levelSlug, levelName, moduleNumber }: EmptyModuleProps) {
  return (
    <div>
      <SectionHeading
        level={1}
        eyebrow={`${levelName} · Módulo ${moduleNumber}`}
        title="Todavía no hay nada cargado"
        accent="en este módulo."
        subtitle="Cuando tu docente publique la presentación y la actividad, las vas a ver acá."
      />
      <div className="mt-10">
        <Button href={`/campus/${levelSlug}`} variant="outline">
          <ArrowLeftIcon className="h-4 w-4" />
          Volver a los módulos
        </Button>
      </div>
    </div>
  );
}
