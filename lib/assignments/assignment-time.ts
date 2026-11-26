const ARGENTINA_TIME_ZONE = "America/Argentina/Buenos_Aires";
const ARGENTINA_UTC_OFFSET = "-03:00";
const ARGENTINA_UTC_OFFSET_MS = 3 * 60 * 60 * 1000;
const LOCAL_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const LOCAL_INPUT_LENGTH = 16;

const shortDayFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  timeZone: ARGENTINA_TIME_ZONE,
});

const timeFormatter = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: ARGENTINA_TIME_ZONE,
});

const momentFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: ARGENTINA_TIME_ZONE,
});

export function argentinaLocalToIso(localDateTime: string): string | null {
  if (!LOCAL_INPUT_PATTERN.test(localDateTime)) return null;
  const date = new Date(`${localDateTime}:00${ARGENTINA_UTC_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function isoToArgentinaLocal(isoDate: string | null): string {
  if (!isoDate) return "";
  const shifted = new Date(new Date(isoDate).getTime() - ARGENTINA_UTC_OFFSET_MS);
  return shifted.toISOString().slice(0, LOCAL_INPUT_LENGTH);
}

export function formatShortDeadline(isoDate: string): string {
  const date = new Date(isoDate);
  return `${shortDayFormatter.format(date)} a las ${timeFormatter.format(date)}`;
}

export function formatMoment(isoDate: string): string {
  return momentFormatter.format(new Date(isoDate));
}
