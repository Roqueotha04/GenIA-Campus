import type { UserRole } from "@/types/database";

export const ADMIN_PATH = "/campus/admin";
export const ADMIN_USERS_PATH = "/campus/admin/usuarios";
export const ADMIN_COURSES_PATH = "/campus/admin/cursos";
export const NEW_ENTITY_FLAG = "1";

interface UserListFilters {
  role: UserRole | null;
  searchTerm: string;
}

export function buildAdminUserPath(userId: string): string {
  return `${ADMIN_USERS_PATH}/${userId}`;
}

export function buildAdminCoursePath(courseId: string): string {
  return `${ADMIN_COURSES_PATH}/${courseId}`;
}

export function buildAdminUsersListPath({ role, searchTerm }: UserListFilters): string {
  const searchParams = new URLSearchParams();
  if (role) searchParams.set("rol", role);
  if (searchTerm) searchParams.set("q", searchTerm);
  const queryString = searchParams.toString();
  return queryString ? `${ADMIN_USERS_PATH}?${queryString}` : ADMIN_USERS_PATH;
}

export function buildNewEntityPath(listPath: string): string {
  return `${listPath}?nuevo=${NEW_ENTITY_FLAG}`;
}
