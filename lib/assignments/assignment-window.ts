import { formatShortDeadline } from "./assignment-time";

export type AssignmentWindow = "open" | "late-allowed" | "closed";

interface DeadlineSettings {
  due_at: string | null;
  allow_late: boolean;
}

export function getAssignmentWindow({ due_at, allow_late }: DeadlineSettings, now = new Date()): AssignmentWindow {
  if (!due_at || now.getTime() <= new Date(due_at).getTime()) return "open";
  return allow_late ? "late-allowed" : "closed";
}

export function acceptsSubmissions(window: AssignmentWindow): boolean {
  return window !== "closed";
}

export function buildClosedMessage(dueAt: string): string {
  return `La entrega cerró el ${formatShortDeadline(dueAt)}. Si necesitás más tiempo, hablá con tu docente.`;
}

export function getClosedMessage(settings: DeadlineSettings): string | null {
  if (!settings.due_at || acceptsSubmissions(getAssignmentWindow(settings))) return null;
  return buildClosedMessage(settings.due_at);
}

export function isSubmittedLate(submittedAt: string, dueAt: string | null): boolean {
  return dueAt !== null && new Date(submittedAt).getTime() > new Date(dueAt).getTime();
}
