import { cookies } from "next/headers";

export const COOKIE_NAME = "access_token";

export async function getToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value;
}

export async function setTokenCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}

export async function clearTokenCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
