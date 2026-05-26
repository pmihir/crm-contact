import { classNames } from "../../lib/classNames";
import type { SectionCardProps } from "../types";
import styles from "./SectionCard.module.css";

export default function SectionCard({ title, actions, children, className = "" }: SectionCardProps) {
  return (
    <section className={classNames(styles.sectionCard, className)}>
      {title ? (
        <header className={styles.header}>
          <h2>{title}</h2>
          {actions}
        </header>
      ) : null}
      {children}
    </section>
  );
}
