import { ResponseError } from "@/lib/errors";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

async function request(path: string, init: RequestInit = {}) {
  return fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init.headers },
  });
}

export async function login(email: string, password: string): Promise<void> {
  const res = await request("/authentication/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json();
    throw new ResponseError(res.status, body.messages);
  }
}

export async function register(
  username: string,
  email: string,
  password: string,
): Promise<void> {
  const res = await request("/authentication/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const body = await res.json();
    throw new ResponseError(res.status, body.messages);
  }
}

export async function logout() {
  await request("/authentication/logout", { method: "POST" });
}
