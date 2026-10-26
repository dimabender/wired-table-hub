"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "@/styles/components/Toast.module.css";
import { clsx } from "@/lib/utils";

enum ToastType {
  Info = "info",
  Success = "success",
  Error = "error",
}
type ToastItem = {
  id: number;
  type: ToastType;
  message: string;
  leaving?: boolean;
};

type ToastApi = {
  info: (message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
};

const DEFAULT_DURATION = 4000;
const MAX_TOASTS = 3;

const icons: Record<ToastType, string> = {
  [ToastType.Info]: "i",
  [ToastType.Success]: "✓",
  [ToastType.Error]: "!",
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismiss = useCallback((id: number) => {
    setItems((prev) =>
      prev.map((t) =>
        t.id === id && !t.leaving ? { ...t, leaving: true } : t,
      ),
    );
  }, []);

  const show = useCallback(
    (message: string, type: ToastType, duration = DEFAULT_DURATION) => {
      const id = nextId.current++;

      setItems((prev) => {
        const active = prev.filter((t) => !t.leaving);
        const overflow = active.length - MAX_TOASTS + 1;
        const evict = new Set(
          active.slice(0, Math.max(0, overflow)).map((t) => t.id),
        );

        return [
          ...prev.map((t) => (evict.has(t.id) ? { ...t, leaving: true } : t)),
          { id, type, message },
        ];
      });

      setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      info: (m, d) => show(m, ToastType.Info, d),
      success: (m, d) => show(m, ToastType.Success, d),
      error: (m, d) => show(m, ToastType.Error, d),
    }),
    [show, dismiss],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={styles.root}>
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={clsx(
              styles.toast,
              styles[t.type],
              t.leaving && styles.leaving,
            )}
            onAnimationEnd={(e) => {
              if (t.leaving && e.target === e.currentTarget) remove(t.id);
            }}
          >
            <div>
              <span className={styles.icon}>{icons[t.type]}</span>
              <span className={styles.message}>{t.message}</span>
            </div>
            <button className={styles.button} onClick={() => dismiss(t.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
