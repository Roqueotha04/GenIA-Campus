import type { ResourceKind } from "@/types/database";

export interface CourseResourceItem {
  id: string;
  kind: ResourceKind;
  title: string;
  href: string | null;
  isDownload: boolean;
  opensInNewTab: boolean;
}

export interface CourseAssignmentItem {
  id: string;
  title: string;
  href: string;
  dueLabel: string | null;
}

export interface CourseSectionContent {
  id: string;
  title: string;
  description: string;
  resources: CourseResourceItem[];
  assignments: CourseAssignmentItem[];
}

export interface CourseNoticeItem {
  id: string;
  title: string;
  body: string;
  createdLabel: string;
  authorName: string | null;
}

export type ModuleAvailability = "available" | "enrolled";
