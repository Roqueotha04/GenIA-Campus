import type { CourseSummary } from "@/lib/courses/course-access";
import type { TableRow } from "@/types/database";
import type { CourseResourceItem, CourseSectionContent } from "./course-content-types";
import {
  buildCourseAssignmentHref,
  buildCourseGameHref,
  buildCourseQuizHref,
} from "./course-routes";
import { formatDueLabel } from "./format-course-date";

export type SectionRow = Pick<TableRow<"sections">, "id" | "title" | "description" | "position">;

export type ResourceRow = Pick<
  TableRow<"resources">,
  "id" | "section_id" | "kind" | "title" | "storage_path" | "url" | "game_slug" | "quiz_id"
>;

export type AssignmentRow = Pick<TableRow<"assignments">, "id" | "section_id" | "title" | "due_at">;

interface BuildCourseSectionsInput {
  course: CourseSummary;
  sections: SectionRow[];
  resources: ResourceRow[];
  assignments: AssignmentRow[];
  signedUrls: Map<string, string>;
}

function toResourceItem(
  course: CourseSummary,
  resource: ResourceRow,
  signedUrls: Map<string, string>,
): CourseResourceItem {
  const base = { id: resource.id, kind: resource.kind, title: resource.title };

  switch (resource.kind) {
    case "file":
      return {
        ...base,
        href: resource.storage_path ? (signedUrls.get(resource.storage_path) ?? null) : null,
        isDownload: true,
        opensInNewTab: false,
      };
    case "link":
      return { ...base, href: resource.url, isDownload: false, opensInNewTab: true };
    case "game":
      return {
        ...base,
        href: resource.game_slug ? buildCourseGameHref(course, resource.game_slug) : null,
        isDownload: false,
        opensInNewTab: false,
      };
    case "quiz":
      return {
        ...base,
        href: resource.quiz_id ? buildCourseQuizHref(course, resource.quiz_id) : null,
        isDownload: false,
        opensInNewTab: false,
      };
  }
}

export function collectFilePaths(resources: ResourceRow[]): string[] {
  return resources.flatMap((resource) =>
    resource.kind === "file" && resource.storage_path ? [resource.storage_path] : [],
  );
}

export function buildCourseSections({
  course,
  sections,
  resources,
  assignments,
  signedUrls,
}: BuildCourseSectionsInput): CourseSectionContent[] {
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    description: section.description,
    resources: resources
      .filter((resource) => resource.section_id === section.id)
      .map((resource) => toResourceItem(course, resource, signedUrls)),
    assignments: assignments
      .filter((assignment) => assignment.section_id === section.id)
      .map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        href: buildCourseAssignmentHref(course, assignment.id),
        dueLabel: formatDueLabel(assignment.due_at),
      })),
  }));
}
