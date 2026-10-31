"use client";

import { createContext, useCallback, useMemo, type ReactNode } from "react";
import { authenticate, findSessionUser, type SessionUser } from "@/lib/auth";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const STORAGE_KEY = "campus-session";

export interface SessionContextValue {
  user: SessionUser | null;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useLocalStorage<string | null>(STORAGE_KEY, null);

  const user = useMemo(() => (userId ? findSessionUser(userId) : null), [userId]);

  const signIn = useCallback(
    (email: string, password: string) => {
      const authenticatedUser = authenticate(email, password);
      if (!authenticatedUser) return false;
      setUserId(authenticatedUser.id);
      return true;
    },
    [setUserId],
  );

  const signOut = useCallback(() => setUserId(null), [setUserId]);

  const value = useMemo<SessionContextValue>(
    () => ({ user, signIn, signOut }),
    [user, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
