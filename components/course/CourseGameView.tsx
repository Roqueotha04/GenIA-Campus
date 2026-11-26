import { buildCourseHref, type CourseSummary } from "@/lib/courses/course-access";
import type { RegisteredGame } from "@/data/games";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CourseBreadcrumb } from "./CourseBreadcrumb";

interface CourseGameViewProps {
  course: CourseSummary;
  levelName: string;
  game: RegisteredGame;
}

export function CourseGameView({ course, levelName, game }: CourseGameViewProps) {
  return (
    <Section>
      <CourseBreadcrumb course={course} levelName={levelName} currentLabel={game.title} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading level={1} eyebrow="Juego" title={game.title} subtitle={course.title} />
        <Button href={buildCourseHref(course)} variant="outline" size="sm">
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
