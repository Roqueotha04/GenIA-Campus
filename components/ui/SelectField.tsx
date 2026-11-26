import { useId } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  required?: boolean;
}

export function SelectField({ label, name, options, defaultValue, required }: SelectFieldProps) {
  const fieldId = useId();

  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={fieldId}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 h-12 w-full rounded-sm border border-line bg-surface px-4 text-base text-foreground transition-colors focus:border-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
