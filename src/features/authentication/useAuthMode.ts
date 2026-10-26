"use client";

import { useSearchParams } from "next/navigation";
import { AuthMode } from "./copy";

export default function useAuthMode(): AuthMode {
  const params = useSearchParams();
  return params.get("mode") === "signup" ? "signup" : "login";
}
