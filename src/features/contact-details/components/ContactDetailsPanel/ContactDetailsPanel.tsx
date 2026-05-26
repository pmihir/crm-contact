import { useEffect, useMemo, useState } from "react";
import { LuArrowLeft, LuChevronLeft, LuChevronRight, LuListFilter, LuSearch } from "react-icons/lu";
import { Button } from "../../../../shared/ui";
import { classNames } from "../../../../shared/lib/classNames";
import type { ContactDetailsPanelProps, ContactFieldValue, EditableContactData } from "../../types";
import { buildContactDetailFolders } from "../../helpers/buildContactDetailFolders";
import ContactOverviewCard from "../ContactOverviewCard/ContactOverviewCard";
import FieldFolder from "../FieldFolder/FieldFolder";
import styles from "./ContactDetailsPanel.module.css";

export default function ContactDetailsPanel({ title, contact, fieldsConfig }: ContactDetailsPanelProps) {
  const [editableContact, setEditableContact] = useState<EditableContactData>(contact);

  useEffect(() => {
    setEditableContact(contact);
  }, [contact]);

  const folders = useMemo(() => buildContactDetailFolders(fieldsConfig, editableContact), [fieldsConfig, editableContact]);

  function handleFieldSave(key: string, value: ContactFieldValue) {
    setEditableContact((currentContact) => ({
      ...currentContact,
      [key]: value,
    }));
  }

  return (
    <aside className={styles.contactPanel}>
      <header className={styles.top}>
        <Button aria-label="Back">
          <LuArrowLeft size={17} />
        </Button>
        <h1>{title}</h1>
        <span className={styles.recordCount}>1 of 356</span>
        <Button aria-label="Previous contact">
          <LuChevronLeft size={17} />
        </Button>
        <Button aria-label="Next contact">
          <LuChevronRight size={17} />
        </Button>
      </header>

      <ContactOverviewCard contact={editableContact} />

      <div className={styles.tabStrip} role="tablist" aria-label="Contact detail views">
        <button className={classNames(styles.tab, styles.activeTab)} type="button">
          All Fields
        </button>
        <button className={styles.tab} type="button">
          DND
        </button>
        <button className={styles.tab} type="button">
          Actions
        </button>
      </div>

      <div className={styles.searchRow}>
        <LuSearch size={15} aria-hidden="true" />
        <input aria-label="Search fields and folders" placeholder="Search Fields and Folders" />
        <Button aria-label="Filter fields">
          <LuListFilter size={15} />
        </Button>
      </div>

      <div className={styles.folderStack}>
        {folders.map((folder) => (
          <FieldFolder key={folder.id} folder={folder} onFieldSave={handleFieldSave} />
        ))}
      </div>
    </aside>
  );
}
