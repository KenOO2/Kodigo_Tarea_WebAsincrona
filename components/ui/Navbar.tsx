import Link from "next/link";
import { getToken } from "@/lib/session";
import CartBadge from "./CartBadge";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const token = await getToken();

  return (
    <header className="sticky top-0 z-10 border-b-4 border-ink bg-sky">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-display text-sm text-white drop-shadow-[2px_2px_0_#1b1d22] sm:text-base">
          🕹️ PIXEL SHOP
        </Link>
        <nav className="flex items-center gap-5 text-xs font-display text-ink sm:text-sm">
          <Link href="/" className="rounded-md bg-paper px-2 py-1 hover:bg-coin">
            Catálogo
          </Link>
          {token && (
            <Link href="/historial" className="rounded-md bg-paper px-2 py-1 hover:bg-coin">
              Historial
            </Link>
          )}
          <Link href="/carrito" className="rounded-md bg-paper px-2 py-1 hover:bg-coin">
            <CartBadge />
          </Link>
          {token ? (
            <LogoutButton />
          ) : (
            <Link
              href="/login"
              className="pixel-btn rounded-md bg-pipe px-3 py-2 text-white hover:bg-pipe-dark"
            >
              Start ▶
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
