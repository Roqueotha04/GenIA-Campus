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
        className="h-5 w-5 rounded-sm border border-line accent-primary"
      />
      <label htmlFor={fieldId} className="text-sm text-foreground">
        {label}
      </label>
    </div>
  );
}
