import type { Notice } from "@/data/schemas";

function NoticeItem({ notice }: { notice: Notice }) {
  return (
    <li className="border border-line bg-surface p-6 md:p-8">
      <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl">
        {notice.title}
      </h2>
      <p className="mt-2 text-sm text-muted">
        {notice.author} · {notice.date}
      </p>
      <p className="mt-5 max-w-3xl whitespace-pre-line text-base leading-relaxed text-foreground">
        {notice.message}
      </p>
    </li>
  );
}

export function NoticeBoard({ notices }: { notices: Notice[] }) {
  if (notices.length === 0) {
    return (
      <div className="border border-line bg-surface p-8 md:p-12">
        <p className="font-heading text-xl font-semibold tracking-tight text-foreground">
          Todavía no hay avisos
        </p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Cuando el docente publique un aviso para este módulo, aparece acá.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-5">
      {notices.map((notice) => (
        <NoticeItem key={`${notice.date}-${notice.title}`} notice={notice} />
      ))}
    </ul>
  );
}
