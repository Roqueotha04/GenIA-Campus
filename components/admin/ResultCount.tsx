interface ResultCountProps {
  count: number;
  singularLabel: string;
  pluralLabel: string;
}

export function ResultCount({ count, singularLabel, pluralLabel }: ResultCountProps) {
  return (
    <p className="text-sm text-muted" aria-live="polite">
      {count} {count === 1 ? singularLabel : pluralLabel}
    </p>
  );
}
