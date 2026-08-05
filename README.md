# Coaching Platform

Next.js + React + TypeScript + Tailwind + Firebase (Auth + Firestore).

## Qué cambió en esta versión

- `/login` — login real con correo y contraseña (Firebase Auth).
- `/portal` — ahora está protegido: si no has iniciado sesión te manda a `/login`.
  Ya no muestra datos de "Camila" de ejemplo — lee los datos reales del estudiante
  que inició sesión, desde Firestore.

## Paso 1 — Crea tu proyecto de Firebase (gratis, 5 minutos)

1. Ve a console.firebase.google.com, inicia sesión con tu cuenta de Google.
2. "Add project" → ponle un nombre (ej. `seb-coaching`) → sigue los pasos (puedes
   desactivar Google Analytics, no lo necesitas) → "Create project".
3. Adentro del proyecto, en el menú de la izquierda: **Build → Authentication**
   → "Get started" → pestaña "Sign-in method" → habilita **"Email/Password"**.
4. Menú izquierdo: **Build → Firestore Database** → "Create database" → elige
   modo **"Start in test mode"** por ahora (lo ajustamos después) → elige una
   ubicación cercana (ej. `us-central`) → "Enable".
5. Menú izquierdo, ícono de engranaje ⚙️ → **Project settings** → baja hasta
   "Your apps" → clic en el ícono `</>` (Web) → dale un nombre → "Register app".
   Te muestra un bloque de código con `apiKey`, `authDomain`, etc. — esos son
   tus valores.

## Paso 2 — Pega esos valores en Vercel

1. Ve a tu proyecto en vercel.com → pestaña **Settings** → **Environment Variables**.
2. Agrega una por una, con estos nombres exactos (usando los valores que copiaste):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
3. Después de agregarlas, ve a la pestaña **Deployments**, abre el menú "..." del
   último deploy → **"Redeploy"** (para que tome las nuevas variables).

## Paso 3 — Crea las cuentas de tus 3 estudiantes

Por ahora esto se hace a mano (sin pantalla de "crear cuenta" todavía):

1. Firebase console → **Authentication** → pestaña "Users" → **"Add user"**.
   Ponle el correo y una contraseña temporal a cada uno de tus 3 estudiantes.
2. Copia el **User UID** que le asigna (una cadena larga de letras y números)
   a cada uno.
3. Ve a **Firestore Database** → **"Start collection"** → nombre de la
   colección: `students`.
4. Para el "Document ID", pega el **UID** de ese estudiante (importante: el ID
   del documento debe ser exactamente igual al UID de Authentication).
5. Agrega estos campos al documento (elige el tipo correcto en Firestore):

   | Campo | Tipo | Ejemplo |
   |---|---|---|
   | `name` | string | `Camila` |
   | `nextLesson` | map | `{ title: "Business English", date: "18 julio", time: "4:00 PM" }` |
   | `package` | map | `{ total: 10, used: 6 }` |
   | `homework` | array de maps | `[{ title: "Present Perfect", status: "done", note: "..." }]` |
   | `progress` | map | `{ Gramática: 82, Escucha: 71, Habla: 58 }` |

6. Repite para cada estudiante, con su propio UID como Document ID.

Cuando cada estudiante entre a `/login` con su correo/contraseña, va a ver
automáticamente sus propios datos — nadie ve los datos de otro.

## Correrlo en tu computador (opcional)

```
npm install
npm run dev
```
