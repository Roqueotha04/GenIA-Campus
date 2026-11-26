import { UserIcon } from "@/components/ui/icons";
import type { ForumPostView } from "@/lib/forums/forum-types";
import { PostDeleteForm } from "./PostDeleteForm";

const kindClasses = {
  topic: "border-l-2 border-l-primary",
  reply: "",
} as const;

export function PostItem({ post }: { post: ForumPostView }) {
  return (
    <article className={`rounded-sm border border-line bg-surface ${kindClasses[post.kind]}`}>
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line px-4 py-3">
        <UserIcon className="h-5 w-5 shrink-0 text-muted" />
        <span className="text-sm font-medium text-foreground">{post.authorName}</span>
        <span className="text-sm text-muted">{post.createdLabel}</span>
      </header>
      <p className="whitespace-pre-line px-4 py-4 text-base leading-relaxed text-foreground">{post.body}</p>
      {post.canDelete && (
        <footer className="border-t border-line px-4 py-3">
          <PostDeleteForm postId={post.id} kind={post.kind} />
        </footer>
      )}
    </article>
  );
}
