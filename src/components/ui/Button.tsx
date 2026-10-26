import { clsx } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";
import styles from "@/styles/components/Button.module.css";

type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export default function Button(props: Props) {
  const {
    variant = "primary",
    size = "md",
    children,
    className,
    ...other
  } = props;

  return (
    <button
      className={clsx(styles.button, styles[variant], styles[size], className)}
      {...other}
    >
      {children}
    </button>
  );
}
