import { logoutAction } from "@/lib/actions/auth.actions";

// No necesita "use client": es un <form> normal enlazado a una Server Action,
// funciona incluso antes de que el JS del cliente cargue.
export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-md bg-paper px-2 py-1 font-display text-xs text-ink hover:bg-danger hover:text-white sm:text-sm"
      >
        Salir
      </button>
    </form>
  );
}
