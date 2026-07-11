const BASE_URL = "https://cs2031-2026-1-pc2-techstore-production.up.railway.app";
const TIMEOUT_MS = 10000;

export type ApiErrorKind =
  | "NETWORK"
  | "TIMEOUT"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "SERVER"
  | "UNKNOWN";

export class ApiError extends Error {
  kind: ApiErrorKind;
  status?: number;

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.kind = kind;
    this.status = status;
  }
}

async function extractMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.message === "string") return body.message;
    if (typeof body?.error === "string") return body.error;
  } catch {
    // response had no JSON body
  }
  return fallback;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("TIMEOUT", "El servidor no respondió a tiempo. Intenta de nuevo.");
    }
    throw new ApiError("NETWORK", "No se pudo conectar con el servidor. Verifica tu conexión.");
  }
  clearTimeout(timer);

  if (res.ok) {
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  switch (res.status) {
    case 400:
      throw new ApiError("VALIDATION", await extractMessage(res, "Los datos ingresados no son válidos."), 400);
    case 401:
      throw new ApiError("UNAUTHORIZED", "Tu sesión expiró o no es válida.", 401);
    case 404:
      throw new ApiError("NOT_FOUND", await extractMessage(res, "El recurso solicitado no existe."), 404);
    case 409:
      throw new ApiError("CONFLICT", await extractMessage(res, "Ese usuario o correo ya está registrado."), 409);
    case 500:
      throw new ApiError("SERVER", "Ocurrió un error interno en el servidor. Intenta más tarde.", 500);
    default:
      throw new ApiError("UNKNOWN", await extractMessage(res, "Ocurrió un error inesperado."), res.status);
  }
}
