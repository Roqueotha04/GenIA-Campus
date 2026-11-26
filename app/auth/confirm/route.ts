import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

const EXPIRED_LINK_PATH = "/acceso/recuperar?link=vencido";

function resolveSafeNextPath(rawNext: string | null): string {
  return rawNext?.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/campus";
}

async function verifyEmailLink(searchParams: URLSearchParams): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return !error;
  }
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    return !error;
  }
  return false;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const verified = await verifyEmailLink(searchParams);
  const destination = verified ? resolveSafeNextPath(searchParams.get("next")) : EXPIRED_LINK_PATH;
  return NextResponse.redirect(new URL(destination, request.url));
}
