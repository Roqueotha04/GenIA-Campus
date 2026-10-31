interface QuizOptionProps {
  name: string;
  label: string;
  checked: boolean;
  onSelect: () => void;
}

export function QuizOption({ name, label, checked, onSelect }: QuizOptionProps) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-4 border p-4 text-sm leading-relaxed transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary md:text-base ${
        checked ? "border-primary bg-primary/5 text-foreground" : "border-line hover:border-navy"
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        aria-hidden
        className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
          checked ? "border-primary bg-primary shadow-[inset_0_0_0_3px_white]" : "border-muted"
        }`}
      />
      <span>{label}</span>
    </label>
  );
}
