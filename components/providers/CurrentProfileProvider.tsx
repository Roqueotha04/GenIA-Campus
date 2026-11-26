"use client";

import { createContext, type ReactNode } from "react";
import type { CurrentProfile } from "@/lib/auth/current-profile";

export const CurrentProfileContext = createContext<CurrentProfile | null>(null);

interface CurrentProfileProviderProps {
  profile: CurrentProfile;
  children: ReactNode;
}

export function CurrentProfileProvider({ profile, children }: CurrentProfileProviderProps) {
  return <CurrentProfileContext.Provider value={profile}>{children}</CurrentProfileContext.Provider>;
}
