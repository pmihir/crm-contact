import type { ReactElement } from "react";
import type { IconType } from "react-icons";
import type { ContactData, ContactFieldsConfig } from "../../features/contact-details";
import type { ConversationItem } from "../../features/conversations";
import type { Note } from "../../features/notes";

export type KnownLayoutSectionType = "contactDetails" | "conversations" | "notes";
export type LayoutSectionType = KnownLayoutSectionType | (string & {});

export type LayoutSection = {
  id: string;
  type: LayoutSectionType;
  title: string;
  order: number;
};

export type LayoutConfig = {
  sections: LayoutSection[];
};

export type LayoutVariant = "default" | "notesFirst";

export type ContactPageData = {
  layout: LayoutConfig;
  contactFields: ContactFieldsConfig;
  contact: ContactData;
  notes: Note[];
  conversations: ConversationItem[];
};

export type ContactPageService = {
  getContactPageData(layoutVariant?: LayoutVariant): Promise<ContactPageData>;
  clearCache?(): void;
};

export type ContactPageStyles = Record<string, string>;

export type ContactPageSectionDefinition = {
  className: string;
  render: (section: LayoutSection, data: ContactPageData) => ReactElement;
};

export type SideRailItem = {
  id: string;
  label: string;
  icon: IconType;
  isActive?: boolean;
};

export type ContactPageResourceMap = {
  layout: LayoutConfig;
  contactFields: ContactFieldsConfig;
  contact: ContactData;
  notes: Note[];
  conversations: ConversationItem[];
};
