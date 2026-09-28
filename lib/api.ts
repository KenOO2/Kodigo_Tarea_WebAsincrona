import type { ApiErrorBody } from "./types";

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.status = status;
    this.body = body;
  }
}

function joinUrl(base: string, path: string) {
  // Evita el bug de "//products" cuando NEXT_PUBLIC_API_BASE_URL
  // trae un "/" final en .env.local.
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...rest } = options;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const url = joinUrl(base, path);

  let res: Response;
  try {
    res = await fetch(url, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...rest.headers,
      },
    });
  } catch {
    // fetch solo lanza si no hubo respuesta HTTP: API caída, puerto
    // equivocado, contenedor detenido, .env.local mal configurado...
    throw new ApiError(0, {
      success: false,
      message: `No se pudo conectar con la API (${url}). Revisa que el contenedor esté corriendo y que NEXT_PUBLIC_API_BASE_URL sea correcta.`,
    });
  }

  if (!res.ok) {
    // Laravel a veces responde HTML (error 500 con debug) o un JSON sin
    // "success". Normalizamos para que siempre haya un mensaje legible.
    let parsed: Partial<ApiErrorBody> | null = null;
    try {
      parsed = (await res.json()) as Partial<ApiErrorBody>;
    } catch {
      parsed = null;
    }

    throw new ApiError(res.status, {
      success: false,
      message: parsed?.message ?? `La API respondió con el código ${res.status} y sin un JSON válido.`,
      errors: parsed?.errors,
    });
  }

  return res.json() as Promise<T>;
}
