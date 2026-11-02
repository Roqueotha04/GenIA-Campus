import type { ResourceKind } from "@/lib/module-resources";
import { ChatIcon, FileIcon, GameIcon, PresentationIcon, QuizIcon } from "@/components/ui/icons";

const iconsByKind = {
  general: FileIcon,
  notices: ChatIcon,
  activity: QuizIcon,
  game: GameIcon,
  assignment: FileIcon,
  presentation: PresentationIcon,
  summary: FileIcon,
};

export function ResourceIcon({ kind, className }: { kind: ResourceKind; className?: string }) {
  const Icon = iconsByKind[kind];
  return <Icon className={className} />;
}
