const SECONDS_PER_MINUTE = 60;

function padTwoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;
  return `${padTwoDigits(minutes)}:${padTwoDigits(seconds)}`;
}
