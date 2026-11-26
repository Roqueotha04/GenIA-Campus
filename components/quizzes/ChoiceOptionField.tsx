import { useId } from "react";

interface ChoiceOptionFieldProps {
  index: number;
  allowMultiple: boolean;
  defaultText: string;
  defaultCorrect: boolean;
}

const optionLetters = ["a", "b", "c", "d", "e", "f"];

export function ChoiceOptionField({ index, allowMultiple, defaultText, defaultCorrect }: ChoiceOptionFieldProps) {
  const fieldId = useId();
  const markerId = `${fieldId}-marker`;

  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-4">
      <div>
        <label htmlFor={fieldId} className="block text-sm font-medium text-foreground">
          Opción {optionLetters[index]}
        </label>
        <input
          id={fieldId}
          name={`option${index}`}
          type="text"
          defaultValue={defaultText}
          className="mt-2 h-12 w-full rounded-sm border border-line bg-surface px-4 text-base text-foreground transition-colors focus:border-primary"
        />
      </div>
      <div className="flex items-center gap-3 sm:h-12">
        <input
          id={markerId}
          type={allowMultiple ? "checkbox" : "radio"}
          name={allowMultiple ? `correct${index}` : "correctIndex"}
          value={allowMultiple ? undefined : String(index)}
          defaultChecked={defaultCorrect}
          className="h-5 w-5 accent-primary"
        />
        <label htmlFor={markerId} className="text-sm text-foreground">
          Correcta
        </label>
      </div>
    </div>
  );
}
