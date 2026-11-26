import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { isGuestAccessOpen, readGuestCredentials } from "@/lib/auth/guest-access";
import { supabasePublishableKey, supabaseUrl } from "./env";

const PROTECTED_PREFIX = "/campus";
const LOGIN_PATH = "/acceso";

function redirectToLogin(request: NextRequest) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = LOGIN_PATH;
  loginUrl.search = "";
  return NextResponse.redirect(loginUrl);
}

async function signInAsGuest(supabase: ReturnType<typeof createServerClient<Database>>) {
  const credentials = readGuestCredentials();
  if (!isGuestAccessOpen() || !credentials) return false;
  const { error } = await supabase.auth.signInWithPassword(credentials);
  return !error;
}

export async function refreshSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims);

  if (!isSignedIn && request.nextUrl.pathname.startsWith(PROTECTED_PREFIX)) {
    const signedInAsGuest = await signInAsGuest(supabase);
    if (!signedInAsGuest) return redirectToLogin(request);
  }

  return response;
}
