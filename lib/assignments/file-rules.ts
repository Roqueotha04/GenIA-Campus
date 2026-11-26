import { ACCEPTED_UPLOAD_TYPES } from "@/lib/storage/storage-buckets";

export function hasAcceptedExtension(fileName: string): boolean {
  const lowerName = fileName.toLowerCase();
  return ACCEPTED_UPLOAD_TYPES.split(",").some((extension) => lowerName.endsWith(extension));
}
