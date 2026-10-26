"use client";

import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import Input from "@/components/ui/Input";
import Link from "next/link";
import useAuthMode from "./useAuthMode";
import { SyntheticEvent, useEffect, useState } from "react";
import { login, register } from "@/entities/session/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import { ResponseError } from "@/lib/errors";
import { FieldErrors, splitResponseError, validate } from "@/lib/validation";
import { loginSchema, registerSchema } from "./schema";
import { COPY } from "./copy";
import styles from "@/styles/features/AuthSection.module.css";

export default function AuthSection() {
  const router = useRouter();
  const toast = useToast();
  const mode = useAuthMode();
  const t = COPY[mode];

  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  const clearError = (name: string) => {
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;

    const fd = new FormData(e.currentTarget);
    const username = String(fd.get("username") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");

    const clientErrors =
      mode === "signup"
        ? validate(registerSchema, { username, email, password })
        : validate(loginSchema, { email, password });

    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) return;

    setPending(true);

    try {
      if (mode === "signup") {
        await register(username, email, password);
      } else {
        await login(email, password);
      }

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ResponseError) {
        const { fieldErrors, general } = splitResponseError(err, fd);
        setErrors(fieldErrors);
        general.forEach((m) => toast.error(m));
        if (!err.messages.length)
          toast.error("Something went wrong. Try again.");
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } finally {
      setPending(false);
    }
  }

  useEffect(() => setErrors({}), [mode]);

  const field = (name: string) => ({
    name,
    error: errors[name],
    onChange: () => clearError(name),
  });

  return (
    <section className={styles.root}>
      <div>
        <h3>{t.title}</h3>
        <p>{t.subtitle}</p>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        {mode === "signup" && (
          <Input
            label="username"
            placeholder="e.g. lainiwakura"
            type="text"
            autoComplete="username"
            {...field("username")}
          />
        )}
        <Input
          label="email"
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
          {...field("email")}
        />
        <Input
          label="password"
          placeholder="At least 8 characters"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          {...field("password")}
        />
        <Button disabled={pending}>{t.submit}</Button>
      </form>
      <Divider>or</Divider>
      <p style={{ textAlign: "center" }}>
        {t.switchText}{" "}
        <Link href={t.switchHref} replace scroll={false}>
          {t.switchLink}
        </Link>
      </p>
    </section>
  );
}
