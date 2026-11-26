import type { ResourceKind } from "@/types/database";
import { FileIcon, GameIcon, PresentationIcon, QuizIcon } from "@/components/ui/icons";

const iconsByKind = {
  file: FileIcon,
  link: PresentationIcon,
  game: GameIcon,
  quiz: QuizIcon,
};

export function CourseResourceIcon({ kind, className }: { kind: ResourceKind; className?: string }) {
  const Icon = iconsByKind[kind];
  return <Icon className={className} />;
}
