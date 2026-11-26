import { levelsWithFeaturedFirst } from "@/lib/catalog";
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

function buildLevelItems(): AccordionItem[] {
  return levelsWithFeaturedFirst.map((level) => ({
    id: level.slug,
    title: (
      <span className="flex items-center gap-3">
        <span aria-hidden className={`h-2 w-2 rounded-full ${levelAccentBackground[level.accent]}`} />
        {level.name}
      </span>
    ),
    content: <LevelModuleList level={level} />,
  }));
}

function buildGreeting(profile: CurrentProfile): string {
  return profile.isGuest ? "Bienvenido" : `Bienvenido, ${profile.full_name}`;
}

interface CampusHomeProps {
  profile: CurrentProfile;
  myCourses: CourseSummary[];
}

export function CampusHome({ profile, myCourses }: CampusHomeProps) {
  return (
    <Section>
      <Reveal>
        <CampusBanner
          greeting={buildGreeting(profile)}
          message="Entrá a tus cursos o elegí un nivel para ver sus módulos."
        />
      </Reveal>
      <Reveal delay={0.08} className="mt-8">
        <MyCoursesSection courses={myCourses} role={profile.role} />
      </Reveal>
      <Reveal delay={0.12} className="mt-8">
        <SectionHeading title="Niveles" />
        <div className="mt-3">
          <Accordion items={buildLevelItems()} />
        </div>
      </Reveal>
    </Section>
  );
}
