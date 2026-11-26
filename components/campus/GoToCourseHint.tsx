import { ArrowRightIcon } from "@/components/ui/icons";

export function GoToCourseHint() {
  return (
    <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary">
      Ir al curso
      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </span>
  );
}
