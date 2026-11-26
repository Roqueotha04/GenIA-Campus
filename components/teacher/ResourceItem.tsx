import { CourseResourceIcon } from "@/components/course/CourseResourceIcon";
import { findRegisteredGame } from "@/data/games";
import { formatMoment } from "@/lib/assignments/assignment-time";
import type { ManagedAssignment } from "@/lib/assignments/assignment-types";
import { formatFileSize } from "@/lib/teacher/format-file-size";
import type { ManagedResource } from "@/lib/teacher/load-course-management";
import { ResourceItemMenu } from "./ResourceItemMenu";

function describeAssignment(assignment: ManagedAssignment): string {
  const deadline = assignment.due_at ? `Entrega: ${formatMoment(assignment.due_at)}` : "Sin fecha de entrega";
  return `${deadline} · ${assignment.submittedCount} de ${assignment.enrolledCount} entregaron`;
}

function describeResource(resource: ManagedResource): string {
  if (resource.assignment) return describeAssignment(resource.assignment);
  if (resource.kind === "link") return resource.url ?? "";
  if (resource.kind === "game") return findRegisteredGame(resource.game_slug ?? "")?.title ?? "Juego no disponible";
  if (resource.kind === "file" && resource.size_bytes) return formatFileSize(resource.size_bytes);
  return "";
}

interface ResourceItemProps {
  resource: ManagedResource;
  isFirst: boolean;
  isLast: boolean;
}

export function ResourceItem({ resource, isFirst, isLast }: ResourceItemProps) {
  const detail = describeResource(resource);

  return (
    <li className="flex items-center gap-3 py-3">
      <CourseResourceIcon kind={resource.kind} className="h-5 w-5 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-medium text-foreground md:text-base">{resource.title}</p>
        {detail && <p className="mt-0.5 break-all text-xs text-muted md:text-sm">{detail}</p>}
      </div>
      <ResourceItemMenu resource={resource} isFirst={isFirst} isLast={isLast} />
    </li>
  );
}
