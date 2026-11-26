export const ADMIN_PATH = "/campus/admin";
export const ADMIN_USERS_PATH = "/campus/admin/usuarios";
export const ADMIN_COURSES_PATH = "/campus/admin/cursos";

export function buildAdminUserPath(userId: string): string {
  return `${ADMIN_USERS_PATH}/${userId}`;
}

export function buildAdminCoursePath(courseId: string): string {
  return `${ADMIN_COURSES_PATH}/${courseId}`;
}
