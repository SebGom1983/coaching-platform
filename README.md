# Coaching Platform — proyecto base

Next.js + React + TypeScript + Tailwind, listo para conectar a Firebase.
Incluye: sitio de marketing (`/`) y portal de estudiante de ejemplo (`/portal`), con datos de muestra.

## Ver esto funcionando en internet, gratis, SIN instalar nada en tu computador

**Paso 1 — Sube esta carpeta a GitHub**
1. Ve a github.com, crea una cuenta si no tienes (gratis).
2. Crea un repositorio nuevo (botón "New repository"), ponle un nombre como `coaching-platform`.
3. En la página del repo vacío, usa la opción "uploading an existing file" y arrastra todos los archivos de esta carpeta.

**Paso 2 — Conecta ese repositorio a Vercel**
1. Ve a vercel.com y crea cuenta gratis con tu usuario de GitHub (botón "Continue with GitHub").
2. Click "Add New" → "Project".
3. Selecciona el repositorio `coaching-platform` que acabas de subir.
4. Vercel detecta automáticamente que es Next.js — no cambies nada, solo dale "Deploy".
5. En 1-2 minutos tendrás una URL real: `coaching-platform-tuusuario.vercel.app`.

Eso es todo. Cada vez que subas cambios a GitHub, Vercel actualiza el sitio solo.

## Cuándo conectar Firebase (más adelante)

Ahora mismo el sitio funciona con datos de ejemplo "quemados" en el código (`app/portal/page.tsx`).
Cuando quieras datos reales (login de estudiantes, progreso guardado, etc.):

1. Crea un proyecto gratis en console.firebase.google.com.
2. Copia las llaves que te da ("SDK config") y pégalas en Vercel → tu proyecto → Settings → Environment Variables, usando los mismos nombres que ves en `.env.example`.
3. Ahí es donde vale la pena tener Claude Code — para escribir la lógica real de login, guardar datos en Firestore, y las Cloud Functions que llaman a OpenAI y Stripe/Wompi.

## Correrlo en tu computador (opcional, solo si luego instalas Node.js)

```
npm install
npm run dev
```

Abre http://localhost:3000
