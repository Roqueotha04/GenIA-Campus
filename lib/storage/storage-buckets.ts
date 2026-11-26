export const COURSE_MATERIALS_BUCKET = "course-materials";
export const SUBMISSIONS_BUCKET = "submissions";

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
export const SIGNED_DOWNLOAD_SECONDS = 60 * 60;

export const ACCEPTED_UPLOAD_TYPES = [
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".zip",
  ".txt",
  ".csv",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
].join(",");

export function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export function buildCourseMaterialPath(courseId: string, sectionId: string, fileName: string): string {
  return `${courseId}/${sectionId}/${crypto.randomUUID()}-${sanitizeFileName(fileName)}`;
}

export function buildSubmissionPath(
  courseId: string,
  assignmentId: string,
  studentId: string,
  fileName: string,
): string {
  return `${courseId}/${assignmentId}/${studentId}/${crypto.randomUUID()}-${sanitizeFileName(fileName)}`;
}
