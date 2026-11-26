import { StatusDot } from "@/components/ui/StatusDot";

interface ActiveStatusProps {
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function ActiveStatus({
  isActive,
  activeLabel = "Activo",
  inactiveLabel = "Inactivo",
}: ActiveStatusProps) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-foreground">
      <StatusDot tone={isActive ? "available" : "empty"} />
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
}
