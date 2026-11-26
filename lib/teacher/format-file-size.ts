const BYTES_PER_KILOBYTE = 1024;
const BYTES_PER_MEGABYTE = BYTES_PER_KILOBYTE * 1024;

export function formatFileSize(sizeBytes: number): string {
  if (sizeBytes >= BYTES_PER_MEGABYTE) return `${(sizeBytes / BYTES_PER_MEGABYTE).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(sizeBytes / BYTES_PER_KILOBYTE))} KB`;
}
