import { ResponseError } from "./errors";

export type FieldErrors = Partial<Record<string, string>>;
type Rule = (v: string) => string | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const byteLen = (s: string) => new TextEncoder().encode(s).length;

export const r = {
  required:
    (msg = "Required"): Rule =>
    (v) =>
      v ? null : msg,
  email:
    (msg = "Invalid email"): Rule =>
    (v) =>
      EMAIL_RE.test(v) ? null : msg,
  min:
    (n: number, msg = `At least ${n} characters`): Rule =>
    (v) =>
      byteLen(v) >= n ? null : msg,
  max:
    (n: number, msg = `At most ${n} characters`): Rule =>
    (v) =>
      byteLen(v) <= n ? null : msg,
};

export type Schema<K extends string> = Record<K, Rule[]>;

export function validate<K extends string>(
  schema: Schema<K>,
  values: Record<K, string>,
): FieldErrors {
  const errors: FieldErrors = {};

  for (const key in schema) {
    for (const rule of schema[key]) {
      const msg = rule(values[key]);
      if (msg) {
        errors[key] = msg;
        break;
      }
    }
  }

  return errors;
}

export function splitResponseError(err: ResponseError, fd: FormData) {
  const fieldErrors: FieldErrors = {};
  const general: string[] = [];

  for (const { field, message } of err.messages) {
    if (field && fd.has(field)) fieldErrors[field] ??= message;
    else general.push(message);
  }

  return { fieldErrors, general };
}
