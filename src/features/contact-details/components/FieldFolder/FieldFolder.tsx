import { useState } from "react";
import { LuChevronDown, LuChevronUp, LuPlus } from "react-icons/lu";
import type { FieldFolderProps } from "../../types";
import ContactFieldItem from "../ContactFieldItem/ContactFieldItem";
import styles from "./FieldFolder.module.css";

export default function FieldFolder({ folder, onFieldSave }: FieldFolderProps) {
  const [isOpen, setIsOpen] = useState(folder.defaultOpen);

  return (
    <section className={styles.fieldFolder}>
      <button className={styles.header} type="button" onClick={() => setIsOpen((open) => !open)}>
        <span>{folder.title}</span>
        <span className={styles.tools}>
          {folder.allowAdd ? <span className={styles.addAction}><LuPlus size={15} /> Add</span> : null}
          {isOpen ? <LuChevronUp size={18} aria-hidden="true" /> : <LuChevronDown size={18} aria-hidden="true" />}
        </span>
      </button>

      {isOpen ? (
        <div className={styles.body}>
          {folder.fields.map((field) => (
            <ContactFieldItem field={field} key={field.key} onSave={onFieldSave} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
