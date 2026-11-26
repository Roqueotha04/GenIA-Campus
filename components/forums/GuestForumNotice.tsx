import { GUEST_FORUM_MESSAGE } from "@/lib/forums/forum-guest";

export function GuestForumNotice() {
  return (
    <p role="status" className="border-l-2 border-primary pl-4 text-sm text-foreground">
      {GUEST_FORUM_MESSAGE}
    </p>
  );
}
