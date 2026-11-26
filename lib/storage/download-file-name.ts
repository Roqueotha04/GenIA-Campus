const FORBIDDEN_FILE_NAME_CHARACTERS = /[\\/:*?"<>|]+/g;
const FALLBACK_FILE_NAME = "archivo";

function readExtension(storagePath: string): string {
  const storedName = storagePath.split("/").pop() ?? "";
  const extensionIndex = storedName.lastIndexOf(".");
  return extensionIndex > 0 ? storedName.slice(extensionIndex) : "";
}

function sanitizeFileName(name: string): string {
  return name.replace(FORBIDDEN_FILE_NAME_CHARACTERS, " ").replace(/\s+/g, " ").trim();
}

export function buildDownloadFileName(displayName: string, storagePath: string): string {
  const extension = readExtension(storagePath);
  const baseName = sanitizeFileName(displayName) || FALLBACK_FILE_NAME;
  const alreadyHasExtension = extension !== "" && baseName.toLowerCase().endsWith(extension.toLowerCase());
  return alreadyHasExtension ? baseName : `${baseName}${extension}`;
}
