import type { NextRequest } from "next/server";
import { refreshSession } from "@/lib/supabase/proxy-session";

export function proxy(request: NextRequest) {
  return refreshSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|material/|juegos/|.*\.(?:svg|png|jpg|jpeg|gif|webp|pdf|docx|html)$).*)",
  ],
};
