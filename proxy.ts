import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 renombró middleware.ts -> proxy.ts (y la función exportada
// pasó de `middleware` a `proxy`). El comportamiento es el mismo: código
// que corre antes de que la petición llegue a la ruta.
//
// Nota: repetimos el nombre de la cookie aquí en vez de importarlo de
// lib/session.ts a propósito, para no arrastrar next/headers (pensado
// para Server Components/Actions) a este archivo.
const COOKIE_NAME = "access_token";
const PROTECTED_PREFIXES = ["/carrito", "/checkout", "/historial"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME);
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/carrito/:path*", "/checkout/:path*", "/historial/:path*"],
};
