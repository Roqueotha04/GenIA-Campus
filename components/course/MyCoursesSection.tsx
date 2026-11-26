import type { CourseSummary } from "@/lib/courses/course-access";
import type { UserRole } from "@/types/database";
import { Carousel } from "@/components/ui/Carousel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MyCourseCard } from "./MyCourseCard";

const emptyMessages: Record<UserRole, string> = {
  alumno:
    "Todavía no estás anotado en ningún curso. Buscalo en Niveles y entrá con la clave que te da tu docente.",
  docente: "Todavía no tenés cursos asignados. Cuando te asignen uno, aparece acá.",
  admin: "Todavía no hay cursos creados.",
};

interface MyCoursesSectionProps {
  courses: CourseSummary[];
  role: UserRole;
}

export function MyCoursesSection({ courses, role }: MyCoursesSectionProps) {
  return (
    <div>
      <SectionHeading title="Mis cursos" />
      <div className="mt-8">
        {courses.length === 0 ? (
          <p className="max-w-xl text-sm leading-relaxed text-muted">{emptyMessages[role]}</p>
        ) : (
          <Carousel columns={3}>
            {courses.map((course) => (
              <MyCourseCard key={course.id} course={course} />
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
}
