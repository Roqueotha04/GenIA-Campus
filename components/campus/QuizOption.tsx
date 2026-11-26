type QuizOptionInputType = "radio" | "checkbox";

interface QuizOptionProps {
  name: string;
  inputType: QuizOptionInputType;
  letter: string;
  label: string;
  checked: boolean;
  onSelect: () => void;
}

export function QuizOption({ name, inputType, letter, label, checked, onSelect }: QuizOptionProps) {
  const indicatorShape = inputType === "radio" ? "rounded-full" : "rounded-sm";

  return (
    <label
      className={`flex cursor-pointer items-start gap-3 border bg-surface p-3 text-sm leading-relaxed transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary md:p-4 md:text-base ${
        checked ? "border-primary text-foreground" : "border-line hover:border-navy"
      }`}
    >
      <input
        type={inputType}
        name={name}
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        aria-hidden
        className={`mt-0.5 h-4 w-4 shrink-0 border-2 ${indicatorShape} ${
          checked ? "border-primary bg-primary shadow-[inset_0_0_0_3px_white]" : "border-muted"
        }`}
      />
      <span>
        <span className="mr-2 font-semibold text-muted">{letter}.</span>
        {label}
      </span>
    </label>
  );
}
