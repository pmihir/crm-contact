import type {
  ContactData,
  ContactFieldsConfig,
  ContactFieldValue,
  ContactFolderViewModel,
} from "../types";

function isEmptyValue(value: ContactFieldValue) {
  return value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
}

export function buildContactDetailFolders(
  fieldsConfig: ContactFieldsConfig,
  contact: ContactData,
): ContactFolderViewModel[] {
  return fieldsConfig.folders.map((folder) => ({
    id: folder.id,
    title: folder.name,
    defaultOpen: folder.defaultOpen,
    allowAdd: folder.allowAdd,
    fields: folder.fields.map((field) => {
      const value = contact[field.key];

      return {
        ...field,
        value,
        isEmpty: isEmptyValue(value),
      };
    }),
  }));
}
