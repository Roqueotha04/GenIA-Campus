import { users } from "@/data/users";
import type { User } from "@/data/schemas";

export type SessionUser = Omit<User, "password">;

function toSessionUser(user: User): SessionUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function authenticate(email: string, password: string): SessionUser | null {
  const normalizedEmail = email.trim().toLowerCase();
  const match = users.find(
    (user) => user.email === normalizedEmail && user.password === password,
  );
  return match ? toSessionUser(match) : null;
}

export function findSessionUser(id: string): SessionUser | null {
  const match = users.find((user) => user.id === id);
  return match ? toSessionUser(match) : null;
}
