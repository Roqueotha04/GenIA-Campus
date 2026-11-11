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
**MVP de demostración con datos estáticos** para mostrar la idea a los dueños. No hay backend ni base de datos todavía.
- Usuarios, niveles, módulos y actividades viven en `data/` (tipados y validados con Zod al importarse).
- La sesión es simulada: `SessionProvider` guarda el id del usuario en `localStorage` y `RequireSession` protege `/campus`. Las credenciales quedan en el bundle; es temporal y se reemplaza al pasar a backend (previsto: Supabase con auth, matrícula por clave, docentes editando su curso y archivos).
- Los intentos del quiz se guardan en `localStorage` (solo las respuestas; el puntaje se calcula).
- Solo Adultos · Módulo 1 (clases "Introducción a la IA" e "Introducción a los chatbots"), Adultos · Módulo 2 (clase "Introducción a la automatización") y Nivel 3 · Módulo 1 (juego "Las tres preguntas") tienen contenido. El resto de los módulos son navegables pero muestran "Todavía no hay nada cargado". No cargar contenido en otros módulos sin que lo pida el dueño.

## Stack
Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + TypeScript + Framer Motion 12 + Zod.
- Versiones congeladas: nunca downgradear Next/React/Tailwind/TS. Si una librería nueva puede dar problemas de compatibilidad, verificar peer deps antes de agregarla.
- Gestor de paquetes: **pnpm** (fijado en `package.json` → `packageManager`). No introducir lockfiles de `npm`/`yarn`.
- Tailwind 4: el tema se define en `app/globals.css` con `@theme inline`. No hay `tailwind.config.ts`.
- Sin `output: 'export'`: es un Next.js con runtime (se despliega en Vercel).
- Alias de imports: `@/*` apunta a la raíz del proyecto.
- Idioma: **solo español** (voseo argentino). No hay i18n.

## Arquitectura
Las rutas (`app/`) **solo componen**: validan params, llaman a `notFound()` y renderizan componentes. La lógica vive en `components/`, `hooks/` y `lib/`.

```
app/          page (landing) · acceso · campus/[nivel]/[modulo] · layout · not-found · globals.css
components/   ui/ · layout/ · landing/ · campus/ · providers/
data/         schemas.ts · users.ts · levels.ts · quiz-ia-adultos.ts · sample-results.ts
hooks/        useSession · useHydrated · useLocalStorage · useQuizResult
lib/          auth · catalog · level-accent · quiz-scoring
public/       logo-generacion-ia.png · material/ (PDFs de presentaciones)
```

- Rutas: `/` landing · `/acceso` login · `/campus` niveles · `/campus/[nivel]` módulos · `/campus/[nivel]/[modulo]` lista de clases · `/campus/[nivel]/[modulo]/[clase]` presentación, resumen, juego y actividad.
- Slugs de nivel: `nivel-1`, `nivel-2`, `nivel-3`, `adultos`. Módulos: número (niños 1–5, adultos 1–2).
- `params` es una `Promise` en esta versión de Next: usar `await params`.
- Estructura del contenido: nivel → módulo ("Módulo N") → clases. Cargar contenido nuevo = editar `data/levels.ts` (módulo → `classes`). Una clase puede tener `presentationPdf`, `summaryDocument`, `assignments` (TPs), `activity` y `game`. Los PDF/DOCX van en `public/material/`, los juegos HTML autocontenidos en `public/juegos/` (se embeben con iframe `sandbox="allow-scripts"`). `Contenido/` es la carpeta de entrega: lo que se usa se copia a `public/`.
- Componentes que usan hooks, `localStorage` o Framer Motion son Client Components (`"use client"`). El resto queda sin directiva.

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
