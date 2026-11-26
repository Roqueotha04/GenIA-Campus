import type { CourseSummary } from "@/lib/courses/course-access";
import type { TableRow } from "@/types/database";
import type { CourseResourceItem, CourseSectionContent } from "./course-content-types";
import {
  buildCourseAssignmentHref,
  buildCourseForumHref,
  buildCourseGameHref,
  buildCourseQuizHref,
} from "./course-routes";
import { formatDueLabel } from "./format-course-date";

export type SectionRow = Pick<TableRow<"sections">, "id" | "title" | "description" | "position">;

export type ResourceRow = Pick<
  TableRow<"resources">,
  | "id"
  | "section_id"
  | "kind"
  | "title"
  | "storage_path"
  | "url"
  | "game_slug"
  | "quiz_id"
  | "assignment_id"
  | "forum_id"
>;

export type AssignmentDueRow = Pick<TableRow<"assignments">, "id" | "due_at">;

interface ResourceItemContext {
  course: CourseSummary;
  signedUrls: Map<string, string>;
  dueDatesByAssignment: Map<string, string | null>;
}

interface BuildCourseSectionsInput extends ResourceItemContext {
  sections: SectionRow[];
  resources: ResourceRow[];
}

const internalPage = { isDownload: false, opensInNewTab: false };

function toResourceItem(
  resource: ResourceRow,
  { course, signedUrls, dueDatesByAssignment }: ResourceItemContext,
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
        ...internalPage,
        href: resource.game_slug ? buildCourseGameHref(course, resource.game_slug) : null,
      };
    case "quiz":
      return {
        ...base,
        ...internalPage,
        href: resource.quiz_id ? buildCourseQuizHref(course, resource.quiz_id) : null,
      };
    case "assignment":
      return {
        ...base,
        ...internalPage,
        href: resource.assignment_id ? buildCourseAssignmentHref(course, resource.assignment_id) : null,
        subtitle: formatDueLabel(
          resource.assignment_id ? (dueDatesByAssignment.get(resource.assignment_id) ?? null) : null,
        ),
      };
    case "forum":
      return {
        ...base,
        ...internalPage,
        href: resource.forum_id ? buildCourseForumHref(course, resource.forum_id) : null,
      };
  }
}

export function collectFilePaths(resources: ResourceRow[]): string[] {
  return resources.flatMap((resource) =>
    resource.kind === "file" && resource.storage_path ? [resource.storage_path] : [],
  );
}

export function buildDueDatesByAssignment(assignments: AssignmentDueRow[]): Map<string, string | null> {
  return new Map(assignments.map((assignment) => [assignment.id, assignment.due_at]));
}

export function buildCourseSections({
  sections,
  resources,
  ...context
}: BuildCourseSectionsInput): CourseSectionContent[] {
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    description: section.description,
    resources: resources
      .filter((resource) => resource.section_id === section.id)
      .map((resource) => toResourceItem(resource, context)),
  }));
}
