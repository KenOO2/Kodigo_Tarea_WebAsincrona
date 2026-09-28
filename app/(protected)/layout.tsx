import { redirect } from "next/navigation";
import { getToken } from "@/lib/session";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();
  if (!token) redirect("/login");

  return <>{children}</>;
}
