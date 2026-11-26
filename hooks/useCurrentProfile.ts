import { useContext } from "react";
import { CurrentProfileContext } from "@/components/providers/CurrentProfileProvider";
import type { CurrentProfile } from "@/lib/auth/current-profile";

export function useCurrentProfile(): CurrentProfile {
  const profile = useContext(CurrentProfileContext);
  if (!profile) throw new Error("useCurrentProfile debe usarse dentro de CurrentProfileProvider");
  return profile;
}
