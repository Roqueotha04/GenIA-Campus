const ADMIN_TIME_ZONE = "America/Argentina/Buenos_Aires";

const shortDateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: ADMIN_TIME_ZONE,
});

export function formatAdminDate(isoDate: string): string {
  return shortDateFormatter.format(new Date(isoDate));
}
