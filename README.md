# TechStore

E-commerce interno para gestionar catálogo de productos, con autenticación JWT.
React + TypeScript + Vite + Tailwind v4 + react-router-dom.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Backend

Consume la API en:
`https://cs2031-2026-1-pc2-techstore-production.up.railway.app`

(hardcodeado en `src/lib/api.ts`, constante `BASE_URL`).

## Estructura

- `src/lib/api.ts` — cliente fetch centralizado: agrega el JWT en `Authorization`,
  y mapea cada código de error (red/timeout, 400, 401, 404, 409, 500) a un `ApiError` tipado.
- `src/context/AuthContext.tsx` — guarda el token en `localStorage`, expone `login`/`logout`.
  `logout` se dispara automáticamente cuando cualquier request recibe 401.
- `src/components/ProtectedRoute.tsx` — redirige a `/login` si no hay sesión.
- `src/pages/` — Login, Register, Dashboard (catálogo paginado), ProductNew (crear),
  ProductDetail (ver/editar/eliminar).

## Rutas

| Ruta | Descripción |
|---|---|
| `/login` | Inicio de sesión |
| `/register` | Registro |
| `/dashboard` | Catálogo paginado de productos |
| `/products/new` | Crear producto |
| `/products/:id` | Ver, editar o eliminar un producto |

## Manejo de errores implementado

- Error de red / timeout (10s) → banner "no se pudo conectar con el servidor"
- 401 → logout automático + redirección a `/login` con aviso
- 404 → mensaje de "recurso no existe" en la página de detalle
- 400 → mensaje de validación devuelto por el backend
- 409 → mensaje de dato duplicado (usado en registro)
- 500 → mensaje de error interno del servidor
