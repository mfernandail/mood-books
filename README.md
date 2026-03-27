# Mood Books

Mood Books es una experiencia web construida con React + Vite que sugiere libros según tu estado de ánimo. La aplicación conecta con Google via Supabase Auth, muestra una galería de moods curados y, a partir de cada mood, consulta la API de Google Books para recomendar títulos que acompañen tu energía del momento.

## Características principales

- Galería interactiva de estados de ánimo basada en el dataset `src/data/moods.json`.
- Autenticación con Google mediante Supabase (persistencia automática de sesión y control de estado reactivo).
- Modal accesible con recomendaciones provenientes de Google Books; incluye manejo de errores, loading states y placeholders.
- Diseño responsive con atmósfera visual (gradientes, orbes y paneles) y accesos rápidos mediante teclado.
- Configuración lista para desplegarse en Vercel (incluye `vercel.json`).

## Stack

- **Frontend:** React 19, Vite 7, CSS Modules.
- **Datos y Auth:** Supabase (`@supabase/supabase-js`).
- **APIs externas:** Google Books REST API.
- **Herramientas:** ESLint 9, pnpm (recomendado), Vercel.

## Requisitos previos

- Node.js >= 18.17
- pnpm 9 (o npm/yarn, pero el lockfile oficial es `pnpm-lock.yaml`).
- Proyecto de Supabase con autenticación de Google habilitada.
- (Opcional) Clave de Google Books para aumentar el límite de peticiones.

## Configuración local

1. Clona el repositorio e instala dependencias:
   ```bash
   pnpm install
   ```
2. Crea un archivo `.env.local` en la raíz con las siguientes variables:
   ```bash
   VITE_SUPABASE_URL="https://<tu-proyecto>.supabase.co"
   VITE_SUPABASE_ANON_KEY="<tu-anon-key>"
   # Opcional pero recomendado para más cuota
   VITE_GOOGLE_BOOKS_KEY="<tu-api-key>"
   ```
3. Ejecuta el entorno de desarrollo:
   ```bash
   pnpm dev
   ```
4. Abre `http://localhost:5173` y autenticáte con Google.

> Nota: la aplicación lanza un error claro si faltan las variables de Supabase (ver `src/lib/supabaseClient.js`).

## Scripts disponibles

- `pnpm dev`: arranca Vite con HMR.
- `pnpm build`: genera la versión optimizada para producción.
- `pnpm preview`: sirve la build localmente.
- `pnpm lint`: ejecuta ESLint sobre todo el proyecto.

## Arquitectura rápida

- `src/App.jsx`: controla el estado de la sesión (loading/login/session) y orquesta los paneles principales.
- `src/components/LoginPanel.jsx`: flujo de inicio de sesión con Supabase + Google.
- `src/components/SessionPanel.jsx`: muestra los datos básicos del usuario autenticado y permite cerrar sesión.
- `src/components/MoodGallery.jsx`: renderiza la rejilla de moods y dispara las consultas a Google Books.
- `src/components/BookModal.jsx`: modal accesible que despliega los libros recomendados.
- `src/data/moods.json`: fuente curada de estados de ánimo, colores, géneros y palabras clave.

## Integraciones externas

- **Supabase Auth:** se configura en `src/lib/supabaseClient.js`. Habilita Google como proveedor y actualiza los dominios de redirección (`Redirect URLs`) con tu entorno local y producción.
- **Google Books API:** se consume directamente desde el cliente (ver `buildBooksUrl` en `MoodGallery`). Si no defines `VITE_GOOGLE_BOOKS_KEY`, la app usa el endpoint público con la cuota anónima por defecto.

## Personalización

- Ajusta o agrega moods editando `src/data/moods.json`. Cada mood puede definir `genres`, `keywords`, color y emoji.
- Modifica estilos globales en `src/App.css` y los específicos en `src/styles/*.module.css`.

## Despliegue

1. Define las mismas variables de entorno (`VITE_*`) en tu proveedor (Vercel recomendado).
2. Ejecuta `pnpm build` como comando de build y sirve `dist/`.
3. Actualiza los orígenes permitidos de Supabase para incluir la URL pública del deploy.

## Roadmap sugerido

- Persistir selecciones de moods del usuario en Supabase para histórico personal.
- Añadir tests de integración para `MoodGallery` y `BookModal` (mock de fetch + interacciones de accesibilidad).
- Controlar cuotas de Google Books mediante una función proxy (`/api/books`) que añada caché y API key del lado del servidor.

---

Hecho con cariño para lectores que eligen historias según cómo se sienten hoy.
