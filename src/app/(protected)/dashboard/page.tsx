"use client";

import Button from "@/components/ui/Button";
import { logout } from "@/entities/session/api";
import { useSession } from "@/entities/session/SessionProvider";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user } = useSession();

  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();

      router.push("/");
      router.refresh();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div style={{ width: "100%", maxWidth: 800 }}>
      <h1>Welcome back, {`@${user.username}`}</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
