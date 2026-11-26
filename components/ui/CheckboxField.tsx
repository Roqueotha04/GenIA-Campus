import { useId } from "react";

interface CheckboxFieldProps {
  label: string;
  name: string;
  defaultChecked?: boolean;
}

export function CheckboxField({ label, name, defaultChecked }: CheckboxFieldProps) {
  const fieldId = useId();

  return (
    <div className="flex items-center gap-3">
      <input
        id={fieldId}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded-sm border border-line accent-primary"
      />
      <label htmlFor={fieldId} className="text-sm text-foreground">
        {label}
      </label>
    </div>
  );
}
