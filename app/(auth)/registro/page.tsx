"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type AuthActionState } from "@/lib/actions/auth.actions";

const initialState: AuthActionState = { status: "idle" };

function Field({
  label,
  id,
  name,
  type,
  error,
}: {
  label: string;
  id: string;
  name: string;
  type: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-ink-soft" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        className="mt-1 w-full rounded-lg border-[3px] border-ink px-3 py-2 text-sm outline-none"
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export default function RegistroPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  return (
    <div className="pixel-panel mx-auto max-w-sm rounded-xl p-6">
      <h1 className="font-display text-sm text-ink">Crea tu personaje</h1>
      <p className="mt-2 text-sm text-ink-soft">Regístrate para comprar y ver tu historial.</p>

      <form action={formAction} className="mt-8 space-y-4">
        <Field label="Nombre" id="name" name="name" type="text" error={fieldErrors?.name?.[0]} />
        <Field label="Correo" id="email" name="email" type="email" error={fieldErrors?.email?.[0]} />
        <Field
          label="Contraseña"
          id="password"
          name="password"
          type="password"
          error={fieldErrors?.password?.[0]}
        />
        <Field
          label="Confirmar contraseña"
          id="password_confirmation"
          name="password_confirmation"
          type="password"
        />

        {state.status === "error" && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="pixel-btn w-full rounded-lg bg-pipe px-5 py-2.5 font-display text-xs text-white hover:bg-pipe-dark disabled:hover:bg-pipe"
        >
          {pending ? "Creando…" : "Start ▶"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-sky-deep">
          Insert Coin
        </Link>
      </p>
    </div>
  );
}
