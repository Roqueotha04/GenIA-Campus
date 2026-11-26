function readRequiredEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Falta la variable de entorno ${name}. Cargala en .env.local o en Vercel.`);
  return value;
}

export const supabaseUrl = readRequiredEnv(
  "NEXT_PUBLIC_SUPABASE_URL",
  process.env.NEXT_PUBLIC_SUPABASE_URL,
);

export const supabasePublishableKey = readRequiredEnv(
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);
