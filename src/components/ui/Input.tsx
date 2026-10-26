import { clsx } from "@/lib/utils";
import { InputHTMLAttributes, useId } from "react";
import styles from "@/styles/components/Input.module.css";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input(props: Props) {
  const { label, error, className, id, ...other } = props;

  const inputId = id ?? useId();

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(styles.input, error && styles.error, className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...other}
      />
      {error && (
        <span id={`${inputId}-error`} className={styles.errorMsg}>
          {error}
        </span>
      )}
    </div>
  );
}
