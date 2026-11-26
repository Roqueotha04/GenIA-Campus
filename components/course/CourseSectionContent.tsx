import type { CourseSectionContent as CourseSectionData } from "@/lib/course-content/course-content-types";
import { CourseAssignmentRow } from "./CourseAssignmentRow";
import { CourseResourceRow } from "./CourseResourceRow";

export function CourseSectionContent({ section }: { section: CourseSectionData }) {
  const isEmpty = section.resources.length === 0 && section.assignments.length === 0;

  return (
    <div>
      {section.description && (
        <p className="max-w-2xl pb-2 text-sm leading-relaxed text-muted">{section.description}</p>
      )}
      {isEmpty ? (
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
          {section.assignments.map((assignment) => (
            <li key={assignment.id}>
              <CourseAssignmentRow assignment={assignment} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
