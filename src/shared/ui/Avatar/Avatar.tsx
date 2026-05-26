import { classNames } from "../../lib/classNames";
import type { AvatarProps } from "../types";
import styles from "./Avatar.module.css";

const sizeClass = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

export default function Avatar({ name, imageUrl, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className={classNames(styles.avatar, sizeClass[size])} aria-label={name}>
      {imageUrl ? <img src={imageUrl} alt="" /> : initials}
    </span>
  );
}
