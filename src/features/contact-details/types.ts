export type KnownFieldType =
  | "string"
  | "email"
  | "phone"
  | "textarea"
  | "tag"
  | "multi-select"
  | "radio"
  | "date"
  | "url";

export type FieldType = KnownFieldType | (string & {});

export type ContactField = {
  key: string;
  label: string;
  type: FieldType;
};

export type FieldFolderConfig = {
  id: string;
  name: string;
  defaultOpen: boolean;
  allowAdd?: boolean;
  fields: ContactField[];
};

export type ContactFieldsConfig = {
  folders: FieldFolderConfig[];
};

export type ContactData = {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  owner: string;
  followers: string[];
  tags: string[];
  [key: string]: string | string[] | undefined;
};

export type ContactFieldValue = string | string[] | undefined;

export type ContactFieldViewModel = ContactField & {
  value: ContactFieldValue;
  isEmpty: boolean;
};

export type ContactFolderViewModel = {
  id: string;
  title: string;
  defaultOpen: boolean;
  allowAdd?: boolean;
  fields: ContactFieldViewModel[];
};

export type ContactDetailsPanelProps = {
  title: string;
  contact: ContactData;
  fieldsConfig: ContactFieldsConfig;
};

export type ContactOverviewCardProps = {
  contact: ContactData;
};

export type FieldFolderProps = {
  folder: ContactFolderViewModel;
};

export type FieldDisplayProps = {
  value: Exclude<ContactFieldValue, undefined>;
};

export type ContactFieldItemProps = {
  field: ContactFieldViewModel;
};
