import { classNames } from "../../lib/classNames";
import type { ButtonProps } from "../types";
import styles from "./Button.module.css";

const variantClass = {
  ghost: styles.ghost,
  icon: styles.icon,
  smallAdd: styles.smallAdd,
};

export default function Button({ children, className, variant = "ghost", tone = "default", type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={classNames(styles.button, variantClass[variant], tone === "success" && styles.success, className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
