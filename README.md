# Campus Generación IA

Campus virtual del instituto Generación IA. Login real, cursos por nivel y módulo, inscripción con clave, material que los docentes cargan desde la app (archivos, links, juegos, avisos), entregas con corrección y cuestionarios con puntaje. Todo sobre Supabase.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · Framer Motion 12 · Zod · Supabase (Auth, Postgres con RLS, Storage, Realtime) · pnpm.

## Puesta en marcha

1. `.env.local` (y las mismas variables en Vercel):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   SUPABASE_SECRET_KEY=...
   ```
2. Correr en orden los archivos de `supabase/migrations/` en el SQL Editor de Supabase (o `pnpm db:push` con el proyecto enlazado).
3. Crear el primer admin:
   ```bash
   pnpm create-admin --email admin@ejemplo.com --name "Nombre Apellido" --password "clave-segura"
   ```
4. En Supabase → Authentication → URL Configuration: Site URL = dominio de producción y Redirect URLs con `https://<dominio>/**` y `http://localhost:3000/**` (para "Olvidé mi clave").

## Comandos

```bash
pnpm install        # Dependencias
pnpm dev            # Servidor de desarrollo
pnpm build          # Build de producción
pnpm lint           # ESLint
pnpm create-admin   # Crea un usuario admin
```

## Cómo se usa

- **Admin** (`/campus/admin`): crea usuarios (alumnos, docentes, admins), crea cursos (nivel + módulo), asigna docentes, publica y maneja la clave de inscripción.
- **Docente** (`/campus/<nivel>/<módulo>/gestionar`): secciones, archivos, links, juegos, avisos, entregas y cuestionarios.
- **Alumno**: busca el curso en Niveles, entra con la clave y lo ve en "Mis cursos". Lo que sube el docente aparece al instante.

Los juegos HTML se agregan a mano en `public/juegos/` y se registran en `data/games.ts`. Los niveles de niños siguen con contenido estático en `data/levels.ts`.

Reglas del proyecto y convenciones: [AGENTS.md](AGENTS.md).
