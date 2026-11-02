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
      rows={9}
      placeholder="Escribí tu respuesta acá"
      className="w-full resize-y border border-line bg-surface p-5 text-lg leading-relaxed text-foreground placeholder:text-muted/70"
    />
  );
}
