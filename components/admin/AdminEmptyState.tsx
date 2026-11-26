export function AdminEmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-sm border border-dashed border-line bg-surface px-4 py-5 text-sm text-muted">
      {message}
    </p>
  );
}
