import { ReactNode } from "react";
import styles from "@/styles/components/Divider.module.css";
import { clsx } from "@/lib/utils";

interface Props {
  children?: ReactNode;
}

export default function Divider(props: Props) {
  const { children } = props;

  return (
    <div
      className={clsx(styles.root, !!children && styles.withLabel)}
      role="separator"
    >
      {children && <span>{children}</span>}
    </div>
  );
}
