import { useId } from "react";

interface TextAreaFieldProps {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
  hint?: string;
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  required,
  rows = 4,
  hint,
}: TextAreaFieldProps) {
  const fieldId = useId();
  const hintId = `${fieldId}-hint`;

  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <textarea
        id={fieldId}
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={rows}
        aria-describedby={hint ? hintId : undefined}
        className="mt-2 w-full rounded-sm border border-line bg-surface px-4 py-3 text-base text-foreground transition-colors focus:border-primary"
      />
      {hint && (
        <p id={hintId} className="mt-2 text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
