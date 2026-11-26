import Link from "next/link";
import type { ForumTopicSummary } from "@/lib/forums/forum-types";

interface TopicRowProps {
  topic: ForumTopicSummary;
  href: string;
}

function describeReplies(replyCount: number): string {
  if (replyCount === 0) return "Sin respuestas";
  if (replyCount === 1) return "1 respuesta";
  return `${replyCount} respuestas`;
}

export function TopicRow({ topic, href }: TopicRowProps) {
  return (
    <li>
      <Link
        href={href}
        className="group grid gap-1 px-4 py-3 transition-colors hover:bg-background md:grid-cols-[minmax(0,1fr)_8rem_11rem] md:items-center md:gap-6"
      >
        <span className="min-w-0">
          <span className="block font-medium text-foreground group-hover:text-primary">{topic.title}</span>
          <span className="block text-sm text-muted">
            {topic.authorName} · {topic.createdLabel}
          </span>
        </span>
        <span className="text-sm text-muted">{describeReplies(topic.replyCount)}</span>
        <span className="text-sm text-muted">
          <span className="md:hidden">Última actividad: </span>
          {topic.lastActivityLabel}
        </span>
      </Link>
    </li>
  );
}
