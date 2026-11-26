import { formatShortDeadline } from "./assignment-time";

export type AssignmentWindow = "open" | "late" | "closed";

interface DeadlineSettings {
  due_at: string | null;
  cutoff_at: string | null;
}

function hasPassed(isoDate: string | null, now: Date): boolean {
  return isoDate !== null && now.getTime() > new Date(isoDate).getTime();
}

export function getAssignmentWindow({ due_at, cutoff_at }: DeadlineSettings, now = new Date()): AssignmentWindow {
  if (hasPassed(cutoff_at, now)) return "closed";
  if (hasPassed(due_at, now)) return "late";
  return "open";
}

function buildClosedMessage(cutoffAt: string): string {
  return `La entrega cerró el ${formatShortDeadline(cutoffAt)}. Si necesitás más tiempo, hablá con tu docente.`;
}

export function getClosedMessage(settings: DeadlineSettings): string | null {
  if (!settings.cutoff_at || getAssignmentWindow(settings) !== "closed") return null;
  return buildClosedMessage(settings.cutoff_at);
}

export function isSubmittedLate(submittedAt: string, dueAt: string | null): boolean {
  return dueAt !== null && new Date(submittedAt).getTime() > new Date(dueAt).getTime();
}
