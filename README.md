# Campus Generación IA

Campus virtual del instituto Generación IA. Esta versión es un **MVP de demostración con datos estáticos**: login simulado, niveles, módulos, presentaciones y una actividad de multiple choice con puntaje.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · Framer Motion 12 · Zod · pnpm.

## Comandos

```bash
pnpm install   # Dependencias
pnpm dev       # Servidor de desarrollo
pnpm build     # Build de producción
pnpm lint      # ESLint
```

## Cuentas de demostración

| Rol | Email | Clave |
|---|---|---|
| Alumno | alumno1@genia.com | genia1234 |
| Docente | docente1@genia.com | genia1234 |

## Contenido

Todo vive en `data/`:

- `users.ts`: usuarios de demostración.
- `levels.ts`: niveles y módulos. Adultos · Módulo 1 (clase "¿Qué es la IA?") y Nivel 3 · Módulo 1 (juego "Las tres preguntas") tienen contenido.
- `quiz-ia-adultos.ts`: actividad de 10 preguntas sobre IA (aprobación: 6).

Estructura: nivel → módulo → clases. Los PDF/DOCX van en `public/material/` y los juegos HTML en `public/juegos/`; se referencian desde cada clase en `data/levels.ts`.

## Próximos pasos

Backend con base de datos y autenticación real (previsto: Supabase), matrícula por clave de curso, edición de contenido por docentes y carga de archivos de estudiantes.

Reglas del proyecto y convenciones: [AGENTS.md](AGENTS.md).
