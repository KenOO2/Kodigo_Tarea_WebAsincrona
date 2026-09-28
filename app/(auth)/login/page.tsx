"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AuthActionState } from "@/lib/actions/auth.actions";

const initialState: AuthActionState = { status: "idle" };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="pixel-panel mx-auto max-w-sm rounded-xl p-6">
      <h1 className="font-display text-sm text-ink">Insert Coin ▶</h1>
      <p className="mt-2 text-sm text-ink-soft">Ingresa para ver tu historial y comprar.</p>

      <form action={formAction} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm text-ink-soft" htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border-[3px] border-ink px-3 py-2 text-sm outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-ink-soft" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-lg border-[3px] border-ink px-3 py-2 text-sm outline-none"
          />
        </div>

        {state.status === "error" && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="pixel-btn w-full rounded-lg bg-pipe px-5 py-2.5 font-display text-xs text-white hover:bg-pipe-dark disabled:hover:bg-pipe"
        >
          {pending ? "Ingresando…" : "Start ▶"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="text-sky-deep">
          Crea tu personaje
        </Link>
      </p>
    </div>
  );
}
