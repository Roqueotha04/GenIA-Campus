import type { CourseModule } from "@/data/schemas";
import { hasClasses } from "@/lib/catalog";
import type { ModuleAvailability } from "@/lib/course-content/course-content-types";
import { StatusDot } from "@/components/ui/StatusDot";

const availabilityLabels: Record<ModuleAvailability, string> = {
  available: "Disponible",
  enrolled: "Inscripto",
};

const EMPTY_MODULE_LABEL = "Todavía no hay contenido";

function resolveStatusLabel(courseModule: CourseModule, availability?: ModuleAvailability): string {
  if (availability) return availabilityLabels[availability];
  return hasClasses(courseModule) ? availabilityLabels.available : EMPTY_MODULE_LABEL;
}

interface ModuleStatusProps {
  courseModule: CourseModule;
  availability?: ModuleAvailability;
}

export function ModuleStatus({ courseModule, availability }: ModuleStatusProps) {
  const hasContent = Boolean(availability) || hasClasses(courseModule);

  return (
    <span className="flex items-center gap-2 text-sm text-muted">
      <StatusDot tone={hasContent ? "available" : "empty"} />
      {resolveStatusLabel(courseModule, availability)}
    </span>
  );
}
