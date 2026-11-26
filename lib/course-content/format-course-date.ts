const COURSE_TIME_ZONE = "America/Argentina/Buenos_Aires";

const dayFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: COURSE_TIME_ZONE,
});

const dayAndTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: COURSE_TIME_ZONE,
});

export function formatNoticeDate(isoDate: string): string {
  return dayFormatter.format(new Date(isoDate));
}

export function formatDueLabel(isoDate: string | null): string | null {
  if (!isoDate) return null;
  return `Entrega hasta el ${dayAndTimeFormatter.format(new Date(isoDate))}`;
}
