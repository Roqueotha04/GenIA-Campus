import type { Notice } from "@/data/schemas";

function NoticeItem({ notice }: { notice: Notice }) {
  return (
    <li className="border border-line bg-surface p-4 md:p-5">
      <h2 className="font-heading text-base font-semibold text-foreground md:text-lg">
        {notice.title}
      </h2>
      <p className="mt-1 text-xs text-muted">
        {notice.author} · {notice.date}
      </p>
      <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-foreground">
        {notice.message}
      </p>
    </li>
  );
}

export function NoticeBoard({ notices }: { notices: Notice[] }) {
  if (notices.length === 0) {
    return (
      <div className="border border-line bg-surface p-5">
        <p className="font-heading text-base font-semibold text-foreground">
          Todavía no hay avisos
        </p>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
          Cuando el docente publique un aviso para este módulo, aparece acá.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {notices.map((notice) => (
        <NoticeItem key={`${notice.date}-${notice.title}`} notice={notice} />
      ))}
    </ul>
  );
}
