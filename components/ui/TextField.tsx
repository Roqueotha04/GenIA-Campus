import { useId } from "react";

interface TextFieldProps {
  label: string;
  name: string;
  type?: "email" | "password" | "text" | "url" | "number" | "datetime-local";
  autoComplete?: string;
  defaultValue?: string;
  required?: boolean;
  hint?: string;
}

export function TextField({
  label,
  name,
  type = "text",
  autoComplete,
  defaultValue,
  required,
  hint,
}: TextFieldProps) {
  const inputId = useId();
  const hintId = `${inputId}-hint`;

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required={required}
        aria-describedby={hint ? hintId : undefined}
        className="mt-1.5 h-10 w-full rounded-sm border border-line bg-surface px-3 text-sm text-foreground transition-colors focus:border-primary"
      />
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
