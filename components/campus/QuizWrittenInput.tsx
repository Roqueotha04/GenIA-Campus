interface QuizWrittenInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function QuizWrittenInput({ value, onChange }: QuizWrittenInputProps) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Tu respuesta"
      rows={7}
      placeholder="Escribí tu respuesta acá"
      className="w-full resize-y border border-line bg-surface p-3 text-base leading-relaxed text-foreground placeholder:text-muted/70"
    />
  );
}
