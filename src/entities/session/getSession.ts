import { cookies } from "next/headers";
import { cache } from "react";

const API_URL = process.env.API_URL!;

export type User = {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export const getSession = cache(async (): Promise<User | null> => {
  const cookie = (await cookies()).toString();
  if (!cookie) return null;

  const res = await fetch(`${API_URL}/user/me`, {
    headers: { cookie },
    cache: "no-store",
  });

  return res.ok ? res.json() : null;
});
