import type { ReactElement } from "react";
import { Tag } from "../../../../shared/ui";
import { classNames } from "../../../../shared/lib/classNames";
import { formatShortDate } from "../../../../shared/lib/dateFormatters";
import type { ContactFieldItemProps, ContactFieldViewModel, FieldDisplayProps, FieldType, KnownFieldType } from "../../types";
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

function FieldValue({ type, value, isEmpty }: Pick<ContactFieldViewModel, "type" | "value" | "isEmpty">) {
  if (isEmpty || value === undefined) {
    return <span className={classNames(styles.value, styles.empty)}>Not added</span>;
  }

  const DisplayValue = getValueRenderer(type);

  return <DisplayValue value={value} />;
}

export default function ContactFieldItem({ field }: ContactFieldItemProps) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{field.label}</span>
      <FieldValue type={field.type} value={field.value} isEmpty={field.isEmpty} />
    </div>
  );
}
