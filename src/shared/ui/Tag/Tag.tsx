import { classNames } from "../../lib/classNames";
import type { TagProps } from "../types";
import styles from "./Tag.module.css";

const toneClass = {
  blue: styles.blue,
  green: styles.green,
  gray: styles.gray,
};

export default function Tag({ children, tone = "blue" }: TagProps) {
  return <span className={classNames(styles.tag, toneClass[tone])}>{children}</span>;
}
