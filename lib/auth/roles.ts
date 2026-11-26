import type { UserRole } from "@/types/database";

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  docente: "Docente",
  alumno: "Alumno",
};

export const LOGIN_PATH = "/acceso";
export const CAMPUS_PATH = "/campus";
export const MIN_PASSWORD_LENGTH = 8;
