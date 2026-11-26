import type { CourseSectionContent as CourseSectionData } from "@/lib/course-content/course-content-types";
import { CourseResourceRow } from "./CourseResourceRow";

export function CourseSectionContent({ section }: { section: CourseSectionData }) {
  return (
    <div>
      {section.description && (
        <p className="max-w-2xl pb-2 text-sm leading-relaxed text-muted">{section.description}</p>
      )}
      {section.resources.length === 0 ? (
        <p className="py-2 text-sm text-muted">
          Esta sección todavía está vacía. Lo que cargue tu docente aparece acá.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {section.resources.map((resource) => (
            <li key={resource.id}>
              <CourseResourceRow resource={resource} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
