import type { CourseClass, CourseModule, Game, Level } from "@/data/schemas";
import { buildModuleBreadcrumbItems } from "@/lib/breadcrumbs";
import { buildModuleHref } from "@/lib/catalog";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "./Breadcrumb";

interface GameViewProps {
  level: Level;
  courseModule: CourseModule;
  courseClass: CourseClass;
  game: Game;
}

export function GameView({ level, courseModule, courseClass, game }: GameViewProps) {
  return (
    <Section>
      <Breadcrumb items={buildModuleBreadcrumbItems(level, courseModule, game.title)} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading level={1} eyebrow="Juego" title={game.title} subtitle={courseClass.title} />
        <Button href={buildModuleHref(level, courseModule)} variant="outline" size="sm">
          <ArrowLeftIcon className="h-4 w-4" />
          Volver al módulo
        </Button>
      </div>
      <div className="mx-auto mt-6 h-[calc(100svh-24rem)] max-h-[50rem] min-h-[34rem] w-full max-w-5xl border border-line bg-navy">
        <iframe
          src={game.path}
          title={game.title}
          sandbox="allow-scripts"
          className="h-full w-full"
        />
      </div>
    </Section>
  );
}
