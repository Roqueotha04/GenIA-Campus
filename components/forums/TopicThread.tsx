import type { ForumTopicThread } from "@/lib/forums/forum-types";
import { PostItem } from "./PostItem";

function describeReplyHeading(replyCount: number): string {
  if (replyCount === 0) return "Todavía no hay respuestas.";
  if (replyCount === 1) return "1 respuesta";
  return `${replyCount} respuestas`;
}

export function TopicThread({ thread }: { thread: ForumTopicThread }) {
  return (
    <div className="space-y-6">
      <PostItem post={thread.openingPost} />
      <p className="text-sm font-medium text-muted">{describeReplyHeading(thread.replies.length)}</p>
      {thread.replies.length > 0 && (
        <ol className="space-y-4">
          {thread.replies.map((reply) => (
            <li key={reply.id}>
              <PostItem post={reply} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
