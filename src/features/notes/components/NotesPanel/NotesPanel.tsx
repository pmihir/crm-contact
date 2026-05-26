import { LuPlus, LuX } from "react-icons/lu";
import { Button, SectionCard } from "../../../../shared/ui";
import { classNames } from "../../../../shared/lib/classNames";
import { formatRelativeTime } from "../../../../shared/lib/dateFormatters";
import type { NotesPanelProps } from "../../types";
import styles from "./NotesPanel.module.css";

export default function NotesPanel({ title, notes }: NotesPanelProps) {
  return (
    <SectionCard
      title={title}
      className={styles.panel}
      actions={
        <div className={styles.actions}>
          <Button>
            <LuPlus size={17} /> Add
          </Button>
          <Button aria-label="Close notes">
            <LuX size={17} />
          </Button>
        </div>
      }
    >
      <div className={styles.list}>
        {notes.map((note) => (
          <article className={classNames(styles.card, note.priority === "high" && styles.high)} key={note.id}>
            <p>{note.content}</p>
            <span>{formatRelativeTime(note.createdAt)}</span>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
