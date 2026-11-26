"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCourseRealtime, type CourseChange, type CourseRealtimeTable } from "@/hooks/useCourseRealtime";
import { CloseIcon } from "@/components/ui/icons";

const TOAST_VISIBLE_MS = 6000;

const announcementPrefixes: Partial<Record<CourseRealtimeTable, string>> = {
  resources: "Nuevo contenido",
  notices: "Nuevo aviso",
};

function buildAnnouncement(change: CourseChange): string | null {
  const prefix = announcementPrefixes[change.table];
  if (!prefix || !change.isInsert) return null;
  return change.title ? `${prefix}: ${change.title}` : prefix;
}

export function CourseLiveUpdates({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const handleChange = useCallback(
    (change: CourseChange) => {
      router.refresh();
      const message = buildAnnouncement(change);
      if (message) setAnnouncement(message);
    },
    [router],
  );

  useCourseRealtime(courseId, handleChange);

  useEffect(() => {
    if (!announcement) return;
    const timeoutId = window.setTimeout(() => setAnnouncement(null), TOAST_VISIBLE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [announcement]);

  if (!announcement) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-4 rounded-sm border border-line bg-surface p-4 text-sm text-foreground md:left-auto md:right-6 md:mx-0"
    >
      <span className="flex-1">{announcement}</span>
      <button
        type="button"
        onClick={() => setAnnouncement(null)}
        aria-label="Cerrar aviso"
        className="shrink-0 text-muted transition-colors hover:text-foreground"
      >
        <CloseIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
