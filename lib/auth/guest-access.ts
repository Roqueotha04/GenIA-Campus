const GUEST_ACCESS_ENDS_AT = new Date("2026-12-04T03:00:00Z");

export interface GuestCredentials {
  email: string;
  password: string;
}

export function isGuestAccessOpen(now: Date = new Date()): boolean {
  return now < GUEST_ACCESS_ENDS_AT;
}

export function readGuestCredentials(): GuestCredentials | null {
  const email = process.env.GUEST_EMAIL;
  const password = process.env.GUEST_PASSWORD;
  return email && password ? { email, password } : null;
}

export function isGuestEmail(email: string): boolean {
  return email.toLowerCase() === process.env.GUEST_EMAIL?.toLowerCase();
}
