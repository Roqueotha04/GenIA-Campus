import { levels } from "@/data/levels";
import { countModulesWithClasses, formatModuleCount } from "@/lib/catalog";
import { levelAccentBackground } from "@/lib/level-accent";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MyCoursesSection } from "@/components/course/MyCoursesSection";
import type { CurrentProfile } from "@/lib/auth/current-profile";
import type { CourseSummary } from "@/lib/courses/course-access";
import { CampusBanner } from "./CampusBanner";
import { LevelModuleList } from "./LevelModuleList";

const levelItems: AccordionItem[] = levels.map((level) => ({
  id: level.slug,
  title: (
    <span className="flex items-center gap-3">
      <span aria-hidden className={`h-2 w-2 rounded-full ${levelAccentBackground[level.accent]}`} />
      {level.name}
    </span>
  ),
  aside: formatModuleCount(level.modules.length),
  content: <LevelModuleList level={level} />,
}));

const levelsWithContentIds = levels
  .filter((level) => countModulesWithClasses(level) > 0)
  .map((level) => level.slug);

interface CampusHomeProps {
  profile: CurrentProfile;
  myCourses: CourseSummary[];
}

export function CampusHome({ profile, myCourses }: CampusHomeProps) {
  return (
    <Section>
      <Reveal>
        <SectionHeading level={1} eyebrow="Campus virtual" title="Campus Generación IA" />
      </Reveal>
      <Reveal delay={0.1} className="mt-10">
        <CampusBanner
          greeting={`Hola, ${profile.full_name}`}
          message="Elegí un nivel para ver sus módulos, clases, presentaciones y cuestionarios."
        />
      </Reveal>
      <Reveal delay={0.12} className="mt-14">
        <MyCoursesSection courses={myCourses} role={profile.role} />
      </Reveal>
      <Reveal delay={0.15} className="mt-14">
        <SectionHeading title="Niveles" />
        <div className="mt-8">
          <Accordion items={levelItems} defaultOpenIds={levelsWithContentIds} />
        </div>
      </Reveal>
    </Section>
  );
}
