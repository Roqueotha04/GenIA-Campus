import type { ComponentType } from "react";
import type { ResourceKind } from "@/types/database";
import {
  AssignmentIcon,
  FileIcon,
  ForumIcon,
  GameIcon,
  PresentationIcon,
  QuizIcon,
} from "@/components/ui/icons";

const iconsByKind: Record<ResourceKind, ComponentType<{ className?: string }>> = {
  file: FileIcon,
  link: PresentationIcon,
  game: GameIcon,
  quiz: QuizIcon,
  assignment: AssignmentIcon,
  forum: ForumIcon,
};

export function CourseResourceIcon({ kind, className }: { kind: ResourceKind; className?: string }) {
  const Icon = iconsByKind[kind];
  return <Icon className={className} />;
}
