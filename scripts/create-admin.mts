import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";

const MIN_PASSWORD_LENGTH = 8;

function readRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name} en .env.local.`);
  return value;
}

function readAdminArguments() {
  const { values } = parseArgs({
    options: {
      email: { type: "string" },
      name: { type: "string" },
      password: { type: "string" },
    },
  });

  if (!values.email || !values.name || !values.password) {
    throw new Error(
      'Uso: pnpm create-admin --email admin@ejemplo.com --name "Nombre Apellido" --password "clave-segura"',
    );
  }
  if (values.password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`La clave tiene que tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }

  return { email: values.email.trim().toLowerCase(), fullName: values.name.trim(), password: values.password };
}

async function createAdmin() {
  const { email, fullName, password } = readAdminArguments();
  const supabase = createClient(
    readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    readRequiredEnv("SUPABASE_SECRET_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
    app_metadata: { role: "admin" },
  });

  if (error) throw new Error(`No se pudo crear el admin: ${error.message}`);

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: data.user.id, full_name: fullName, email, role: "admin" });

  if (profileError) {
    await supabase.auth.admin.deleteUser(data.user.id);
    throw new Error(`No se pudo crear el perfil del admin: ${profileError.message}`);
  }

  console.log(`Admin creado: ${data.user.email}`);
}

createAdmin().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
