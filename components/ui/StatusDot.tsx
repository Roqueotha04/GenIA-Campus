type StatusTone = "available" | "empty";

const toneClasses: Record<StatusTone, string> = {
  available: "bg-primary",
  empty: "bg-line",
};

export function StatusDot({ tone }: { tone: StatusTone }) {
  return <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${toneClasses[tone]}`} />;
}
