import { useId } from "react";

interface TextFieldProps {
  label: string;
  type: "email" | "password";
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
}

export function TextField({ label, type, autoComplete, value, onChange }: TextFieldProps) {
  const inputId = useId();

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-sm border border-line bg-surface px-4 text-base text-foreground transition-colors focus:border-primary"
      />
    </div>
  );
}
