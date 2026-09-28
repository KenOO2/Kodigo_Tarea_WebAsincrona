"use server";

import { redirect } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { setTokenCookie, clearTokenCookie } from "@/lib/session";
import type { AuthResponse } from "@/lib/types";

export type AuthActionState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> }
  | { status: "success" };

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const res = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // La cookie se setea aquí, en el servidor: nunca pasa por el navegador
    // como texto plano ni queda accesible a JS del cliente (httpOnly).
    await setTokenCookie(res.data.access_token);
  } catch (err) {
    if (err instanceof ApiError) {
      return { status: "error", message: err.body.message, fieldErrors: err.body.errors };
    }
    return { status: "error", message: "No se pudo iniciar sesión. Intenta de nuevo." };
  }

  redirect("/");
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const password_confirmation = String(formData.get("password_confirmation") ?? "");

  try {
    const res = await apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });

    await setTokenCookie(res.data.access_token);
  } catch (err) {
    if (err instanceof ApiError) {
      return { status: "error", message: err.body.message, fieldErrors: err.body.errors };
    }
    return { status: "error", message: "No se pudo completar el registro. Intenta de nuevo." };
  }

  redirect("/");
}

export async function logoutAction() {
  await clearTokenCookie();
  redirect("/login");
}
