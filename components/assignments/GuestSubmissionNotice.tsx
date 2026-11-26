import { GUEST_SUBMISSION_MESSAGE } from "@/lib/assignments/guest-submission";

export function GuestSubmissionNotice() {
  return (
    <p role="status" className="border-l-2 border-primary pl-4 text-sm text-foreground">
      {GUEST_SUBMISSION_MESSAGE}
    </p>
  );
}
