# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Campus — Generación IA

Campus virtual para el instituto Generación IA (Mar del Plata). Nació de una plantilla de landings y hoy es un proyecto Next.js común.

> **Precedencia ante conflicto:** las skills (`.claude/skills/`) mandan primero, luego `CLAUDE.md`, y por último este `AGENTS.md`.
>
> **Skills de diseño:** `frontend-design` guía la dirección visual. `impeccable` y `design-taste-frontend` son checklist de calidad/anti-slop (contraste, jerarquía, layout, copy), nunca fuente de paleta, fuentes, stack ni dependencias. Las "standing defaults de Estudio Ve" de `frontend-design` no aplican a este proyecto.

## Regla #0 — Clean code, sin excepciones
El clean code se prioriza **siempre**, por encima de la velocidad o la conveniencia:
- Nombres descriptivos en todo (variables, funciones, componentes, archivos).
- Componentes pequeños y de una sola responsabilidad.
- Sin comentarios en el código; el código se explica solo.
- Si una solución rápida ensucia el código, no se usa: se busca la versión limpia.

## Estado del proyecto
**Campus dinámico sobre Supabase** (Auth + Postgres con RLS + Storage + Realtime). Foco en Adultos.
- **Usuarios**: no hay registro público. El admin crea las cuentas desde `/campus/admin/usuarios` (Supabase Auth + fila en `profiles` con el rol `admin` | `docente` | `alumno`). Una cuenta sin `profile` no puede usar nada. Primer admin: `pnpm create-admin --email … --name "…" --password "…"`.
- **Cursos** = nivel + módulo (`courses.level_slug` + `module_number`). Los crea el admin, les asigna docentes y los publica. El alumno se inscribe con la **clave del curso**.
- **Contenido del curso** (secciones, archivos, links, juegos, entregas, avisos, cuestionarios) lo cargan docentes/admin desde `/campus/[nivel]/[modulo]/gestionar`. Los alumnos lo ven en vivo (Realtime).
- Si un módulo no tiene curso en la base, se muestra el contenido estático de `data/levels.ts` (niveles de niños). No cargar contenido estático nuevo sin que lo pida el dueño.
- **Acceso de invitado (temporal, hasta el jueves 3/12/2026 inclusive)**: sin sesión, `proxy.ts` entra automáticamente con la cuenta de invitado (`GUEST_EMAIL` / `GUEST_PASSWORD`), inscripta en los cursos de Adultos. El invitado ve todo pero no entrega TPs y sus cuestionarios no se guardan. La fecha de corte está en `lib/auth/guest-access.ts`; pasada esa fecha no hace nada. Para quitarlo: borrar `guest-access.ts` y sus usos (`isGuest`), las variables y la cuenta de invitado.
- **Juegos HTML**: se cargan a mano en `public/juegos/` y se registran en `data/games.ts`; el docente los agrega a una sección.

## Supabase
- Esquema y políticas: `supabase/migrations/*.sql` (se aplican en orden en el SQL Editor o con `pnpm db:push`). Tipos: `types/database.ts` (regenerar con `pnpm db:types` si el proyecto está enlazado).
- Clientes: `lib/supabase/server-client.ts` (Server Components/Actions, respeta RLS), `browser-client.ts` (Realtime y subidas), `admin-client.ts` (clave secreta, solo server, solo cuando RLS no alcanza: crear usuarios, leer cuestionarios para puntuar, guardar intentos).
- `proxy.ts` refresca la sesión y redirige a `/acceso` sin sesión. La autorización real se hace en el server (`requireProfile`, `requireRole`, `getCourseAccess`) y en RLS.
- En `courses` nunca `select("*")`: la columna `enrollment_key` no es legible. Usar `COURSE_SUMMARY_COLUMNS` y los rpc `course_enrollment_key` / `regenerate_enrollment_key` / `enroll_with_key`.
- Los alumnos no leen `quizzes` (para no ver respuestas): el server arma preguntas sin claves y puntúa.
- Archivos: buckets privados `course-materials` y `submissions` (50 MB por archivo). Se suben **directo del navegador** con URL firmada (`createSignedUploadUrl` + `uploadToSignedUrl`), nunca por Server Action. Se descargan con URLs firmadas.
- Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (esta última nunca con prefijo `NEXT_PUBLIC_`).

## Stack
Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + TypeScript + Framer Motion 12 + Zod + Supabase (`@supabase/ssr`).
- Versiones congeladas: nunca downgradear Next/React/Tailwind/TS. Si una librería nueva puede dar problemas de compatibilidad, verificar peer deps antes de agregarla.
- Gestor de paquetes: **pnpm** (fijado en `package.json` → `packageManager`). No introducir lockfiles de `npm`/`yarn`.
- Tailwind 4: el tema se define en `app/globals.css` con `@theme inline`. No hay `tailwind.config.ts`.
- Sin `output: 'export'`: es un Next.js con runtime (se despliega en Vercel).
- Alias de imports: `@/*` apunta a la raíz del proyecto.
- Idioma: **solo español** (voseo argentino). No hay i18n.

## Arquitectura
Las rutas (`app/`) **solo componen**: validan params, llaman a `notFound()` y renderizan componentes. La lógica vive en `components/`, `hooks/` y `lib/`.

```
app/          page (landing) · acceso (login, recuperar, nueva-clave) · auth/confirm · campus/…
components/   ui/ · layout/ · landing/ · auth/ · campus/ (estático) · course/ (alumno) · teacher/ (gestionar) · assignments/ · quizzes/ · admin/ · providers/
data/         schemas.ts · levels.ts (estructura y contenido estático de niños) · games.ts
hooks/        useCurrentProfile · useCourseRealtime · useElapsedSeconds
lib/          supabase/ · auth/ · courses/ · course-content/ · teacher/ · assignments/ · quizzes/ · admin/ · storage/ · forms/ · catalog · quiz-scoring
supabase/     migrations/ (esquema, RLS, storage, realtime)
scripts/      create-admin.mts
public/       logo · juegos/ (HTML)
```

- Rutas: `/` landing · `/acceso` login · `/campus` mis cursos + niveles · `/campus/[nivel]` módulos · `/campus/[nivel]/[modulo]` curso (dinámico si existe en la base; si no, estático) · `…/gestionar` (docente/admin) · `…/gestionar/quizzes` · `…/entregas/[id]` · `…/quiz/[quizId]` · `…/juegos/[slug]` · `…/avisos` · `/campus/admin` (usuarios y cursos).
- Slugs de nivel: `nivel-1`, `nivel-2`, `nivel-3`, `adultos`. Módulos: número (niños 1–5, adultos 1–2).
- `params` y `searchParams` son `Promise` en esta versión de Next: usar `await`.
- Mutaciones: Server Actions en `lib/**` con `"use server"`, validación Zod y verificación de permisos al inicio; `revalidatePath` de lo que cambia. Formularios con `useActionState` + `FormStateMessage` + `SubmitButton` (o `onSubmit` cuando hay que conservar lo escrito ante errores).
- Componentes que usan hooks, `localStorage`, Realtime o Framer Motion son Client Components (`"use client"`). El resto queda sin directiva.

## Componentes
- **Reutilizar siempre los componentes ya programados** (`Section`, `SectionHeading`, `Button`/`ActionButton`, `Carousel`, `Eyebrow`, `Reveal`, `StatusDot`). Crear uno nuevo solo si realmente no existe el que se necesita.
- **Listas de elementos → `Carousel`**: scroll horizontal con snap en mobile, grid desde `md`.
- Todos los `h2` de sección salen de `SectionHeading` (`level={1}` para el `h1` de página). Un solo `h1` por página.

## Diseño
Dirección: **editorial sobria con la paleta de Generación IA**. Nada de look "template AI".
- Paleta (tokens en `app/globals.css`): navy `#0a1640` (tinta y bandas oscuras), azul eléctrico `#0a2cf0` (acción primaria), cian `#2dd4e0` (detalle puntual), papel `#f6f7fa` (fondo del campus), blanco. El logo es un wordmark blanco: siempre sobre superficies oscuras (`surface-dark`).
- Tipografía: Geist (títulos/UI, peso fuerte, tracking apretado) + Instrument Serif itálica para la frase de acento (`font-accent italic`).
- Estructura: mucho aire, cards con línea fina y sin sombra, esquinas rectas (`rounded-sm`), eyebrows en mayúscula espaciada, punto de color como marca de estado. Un color de apoyo por nivel (`level-1`…`level-4`), usado con moderación.
- Sin gradientes decorativos, glass, glow, emojis ni sombras. La numeración (`01`, `02`) solo donde el orden es real (pasos, módulos).
- **Mobile-first y responsive sin excepción**: mobile, tablet y desktop.
- Antes de generar o ajustar UI, leer `frontend-design`.

## Animaciones
Framer Motion **sutil** vía `LazyMotion` + `domAnimation`: usar `m` (no `motion`) y el wrapper `Reveal`. Respeta `prefers-reduced-motion`. No animar por animar.

## Rendimiento
Minimizar el JS del cliente, `next/font/google` con `display: "swap"`, `next/image` para imágenes, `img-shimmer` como placeholder de carga.

## Ejecución — alcance estricto
- La **única** verificación permitida es el build de producción: `pnpm build`, al terminar. Nada más.
- **Prohibido** levantar `pnpm dev`/servidor, abrir el navegador, tomar screenshots o previsualizar, sin importar la circunstancia.
- No ejecutar de más: hacé solo lo pedido. Si el build pasa, terminás ahí.

## Git
- **Prohibido commitear, pushear o crear ramas/PRs** salvo que el usuario lo pida explícitamente en ese momento. Una autorización no se extiende a pedidos posteriores.

## Copy
- Español argentino (voseo), tono cercano y claro, orientado a lo que la persona puede hacer.
- Errores: explican qué pasó y cómo resolverlo, sin disculparse. Estados vacíos: indican qué falta y cuándo aparece.
- Un mismo nombre para cada acción en todo el flujo.

## Skills disponibles
- `frontend-design`: principios de diseño, planificación visual y autocrítica.
- `impeccable` · `design-taste-frontend`: checklist de calidad/anti-slop (ver precedencia arriba).
