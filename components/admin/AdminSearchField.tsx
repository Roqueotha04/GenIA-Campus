import { useId } from "react";
import { SearchIcon } from "@/components/ui/icons";

interface AdminSearchFieldProps {
  name: string;
  label: string;
  placeholder: string;
  defaultValue: string;
}

export function AdminSearchField({ name, label, placeholder, defaultValue }: AdminSearchFieldProps) {
  const inputId = useId();

  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        key={defaultValue}
        id={inputId}
        name={name}
        type="search"
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="h-10 w-full rounded-sm border border-line bg-surface pl-9 pr-3 text-sm text-foreground transition-colors focus:border-primary"
      />
    </div>
  );
}
