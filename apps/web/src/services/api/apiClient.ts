/**
 * Cliente HTTP único de la aplicación (ADR-007).
 *
 * Ningún componente llama a `fetch` directamente: todos pasan por `apiRequest`,
 * que compone la URL base configurada por el usuario con la ruta del catálogo
 * de endpoints, aplica timeout, adjunta el token y traduce errores a `ApiError`.
 */

export type ApiErrorKind =
  | "validation"
  | "unauthorized"
  | "notFound"
  | "unavailable"
  | "server"
  | "network"
  | "parsing";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;

  constructor(kind: ApiErrorKind, message: string, status: number | null = null) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Compone la URL final: URL base introducida manualmente por el usuario
 * (ej. `http://192.168.1.10:5006`) + ruta relativa del endpoint.
 */
export function buildUrl(baseUrl: string, path: string): string {
  const base = baseUrl.trim().replace(/\/+$/, "");
  const route = path.startsWith("/") ? path : `/${path}`;
  return `${base}${route}`;
}

export type ApiRequestOptions = {
  baseUrl: string;
  path: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
  timeoutMs?: number;
  signal?: AbortSignal;
};

export async function apiRequest<T>(options: ApiRequestOptions): Promise<T> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );
  const abortFromCaller = () => controller.abort();
  options.signal?.addEventListener("abort", abortFromCaller);

  const headers: Record<string, string> = { Accept: "application/json" };
  let payload: string | undefined;
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(options.body);
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  try {
    const response = await fetch(buildUrl(options.baseUrl, options.path), {
      method: options.method ?? "GET",
      headers,
      body: payload,
      signal: controller.signal,
    });

    const text = await response.text();

    if (!response.ok) {
      throw toApiError(response.status, text);
    }

    if (!text) {
      return undefined as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new ApiError("parsing", "La respuesta del servidor no es JSON válido.");
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("network", "La solicitud al servidor tardó demasiado.");
    }
    throw new ApiError("network", "No se pudo conectar con el servidor.");
  } finally {
    window.clearTimeout(timeoutId);
    options.signal?.removeEventListener("abort", abortFromCaller);
  }
}

function toApiError(status: number, body: string): ApiError {
  const message = readErrorMessage(body);

  if (status === 400) {
    return new ApiError("validation", message ?? "Los datos enviados no son válidos.", status);
  }
  if (status === 401) {
    return new ApiError("unauthorized", message ?? "No autorizado.", status);
  }
  if (status === 404) {
    return new ApiError("notFound", message ?? "Recurso no encontrado.", status);
  }
  if (status === 503) {
    return new ApiError("unavailable", message ?? "El servidor no está disponible.", status);
  }
  if (status >= 500) {
    return new ApiError("server", message ?? "Error del servidor.", status);
  }
  return new ApiError("server", message ?? `Error ${status} del servidor.`, status);
}

/** Extrae `{ error }` o `{ title }` del cuerpo si el backend los envía. */
function readErrorMessage(body: string): string | null {
  if (!body) return null;

  try {
    const parsed: unknown = JSON.parse(body);
    if (typeof parsed !== "object" || parsed === null) return null;

    const candidate = parsed as { error?: unknown; title?: unknown };
    if (typeof candidate.error === "string" && candidate.error.trim()) {
      return candidate.error;
    }
    if (typeof candidate.title === "string" && candidate.title.trim()) {
      return candidate.title;
    }
  } catch {
    // El cuerpo no es JSON: se usa el mensaje genérico por código de estado.
  }

  return null;
}
