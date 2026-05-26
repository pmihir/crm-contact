import type { KeyboardEvent, ReactElement } from "react";
import { useEffect, useState } from "react";
import { LuCheck, LuPencil, LuX } from "react-icons/lu";
import { Tag } from "../../../../shared/ui";
import { classNames } from "../../../../shared/lib/classNames";
import { formatShortDate } from "../../../../shared/lib/dateFormatters";
import {
  formatEditableFieldValue,
  parseEditableFieldValue,
  validateEditableFieldValue,
} from "../../helpers/fieldValidation";
import type { ContactFieldItemProps, FieldDisplayProps, FieldType, FieldValueProps, KnownFieldType } from "../../types";
import styles from "./ContactFieldItem.module.css";

function TextValue({ value }: FieldDisplayProps) {
  return <span className={styles.value}>{value}</span>;
}

const valueRenderers: Record<KnownFieldType, (props: FieldDisplayProps) => ReactElement> = {
  string: TextValue,
  email: ({ value }) => (
    <a className={styles.link} href={`mailto:${value}`}>
      {value}
    </a>
  ),
  phone: ({ value }) => (
    <span className={styles.phone}>
      <span aria-hidden="true">🇺🇸</span>
      <a className={styles.link} href={`tel:${value}`}>
        {value}
      </a>
    </span>
  ),
  textarea: ({ value }) => <span className={classNames(styles.value, styles.multiline)}>{value}</span>,
  tag: ({ value }) => <Tag tone="green">{String(value)}</Tag>,
  "multi-select": ({ value }) => (
    <span className={styles.chipList}>
      {(Array.isArray(value) ? value : [value]).map((item) => (
        <Tag key={item} tone="gray">
          {item}
        </Tag>
      ))}
    </span>
  ),
  radio: ({ value }) => <Tag tone="green">{String(value)}</Tag>,
  date: ({ value }) => <span className={styles.value}>{formatShortDate(String(value))}</span>,
  url: ({ value }) => (
    <a className={styles.link} href={String(value)} target="_blank" rel="noreferrer">
      {String(value).replace(/^https?:\/\//, "")}
    </a>
  ),
};

function getValueRenderer(type: FieldType) {
  return valueRenderers[type as KnownFieldType] ?? TextValue;
}

function FieldValue({ type, value, isEmpty }: FieldValueProps) {
  if (isEmpty || value === undefined) {
    return <span className={classNames(styles.value, styles.empty)}>Not added</span>;
  }

  const DisplayValue = getValueRenderer(type);

  return <DisplayValue value={value} />;
}

export default function ContactFieldItem({ field, onSave }: ContactFieldItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(formatEditableFieldValue(field.value));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) {
      setDraftValue(formatEditableFieldValue(field.value));
      setError("");
    }
  }, [field.value, isEditing]);

  function handleCancel() {
    setIsEditing(false);
    setDraftValue(formatEditableFieldValue(field.value));
    setError("");
  }

  function handleSave() {
    const nextValue = parseEditableFieldValue(field.type, draftValue);
    const validation = validateEditableFieldValue(field.type, nextValue);

    if (!validation.isValid) {
      setError(validation.message ?? "Enter a valid value.");
      return;
    }

    onSave(field.key, nextValue);
    setIsEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleSave();
    }

    if (event.key === "Escape") {
      handleCancel();
    }
  }

  if (isEditing) {
    const isLongField = field.type === "textarea" || field.type === "multi-select";

    return (
      <div className={styles.field}>
        <span className={styles.label}>{field.label}</span>
        <div className={styles.editStack}>
          <div className={classNames(styles.editControl, isLongField && styles.editControlStacked)}>
            {isLongField ? (
              <textarea
                className={classNames(styles.input, styles.textAreaInput, error && styles.inputError)}
                value={draftValue}
                rows={field.type === "textarea" ? 3 : 2}
                autoFocus
                onChange={(event) => setDraftValue(event.target.value)}
              />
            ) : (
              <input
                className={classNames(styles.input, error && styles.inputError)}
                type={field.type === "date" ? "date" : "text"}
                value={draftValue}
                autoFocus
                onChange={(event) => setDraftValue(event.target.value)}
                onKeyDown={handleKeyDown}
              />
            )}
            <div className={styles.editActions}>
              <button className={styles.saveButton} type="button" aria-label={`Save ${field.label}`} onClick={handleSave}>
                <LuCheck size={15} />
              </button>
              <button className={styles.cancelButton} type="button" aria-label={`Cancel ${field.label}`} onClick={handleCancel}>
                <LuX size={15} />
              </button>
            </div>
          </div>
          {field.type === "multi-select" ? <span className={styles.hint}>Separate multiple values with commas.</span> : null}
          {error ? <span className={styles.error}>{error}</span> : null}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>{field.label}</span>
      <div className={styles.valueRow}>
        <FieldValue type={field.type} value={field.value} isEmpty={field.isEmpty} />
        <button className={styles.editButton} type="button" aria-label={`Edit ${field.label}`} onClick={() => setIsEditing(true)}>
          <LuPencil size={13} />
        </button>
      </div>
    </div>
  );
}
