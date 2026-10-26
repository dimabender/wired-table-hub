import { getSession } from "@/entities/session/getSession";
import { SessionProvider } from "@/entities/session/SessionProvider";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) redirect("/");

  return <SessionProvider initialUser={session!}>{children}</SessionProvider>;
}
