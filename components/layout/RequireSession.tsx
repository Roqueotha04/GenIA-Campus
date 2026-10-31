"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useHydrated } from "@/hooks/useHydrated";
import { useSession } from "@/hooks/useSession";
import { SessionLoading } from "./SessionLoading";

export function RequireSession({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const { user } = useSession();

  useEffect(() => {
    if (hydrated && !user) router.replace("/acceso");
  }, [hydrated, user, router]);

  if (!hydrated || !user) return <SessionLoading />;

  return children;
}
