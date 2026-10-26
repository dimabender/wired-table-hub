import { r, Schema } from "@/lib/validation";

export const loginSchema: Schema<"email" | "password"> = {
  email: [r.required(), r.email(), r.max(254)],
  password: [r.required(), r.min(8), r.max(128)],
};

export const registerSchema: Schema<"username" | "email" | "password"> = {
  username: [r.required(), r.min(3), r.max(32)],
  email: [r.required(), r.email(), r.max(254)],
  password: [r.required(), r.min(8), r.max(128)],
};
