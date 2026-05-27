import { createElement } from "react";
import {
  LuCalendarDays,
  LuClock3,
  LuFileText,
  LuNetwork,
  LuSquareCheck,
} from "react-icons/lu";
import { ContactDetailsPanel } from "../../../features/contact-details";
import { ConversationsPanel } from "../../../features/conversations";
import { NotesPanel } from "../../../features/notes";
import { classNames } from "../../../shared/lib/classNames";
import type {
  ContactPageData,
  ContactPageSectionDefinition,
  ContactPageStyles,
  ContactNavigationHandlers,
  KnownLayoutSectionType,
  LayoutSection,
  SideRailItem,
} from "../types";

export const sideRailItems: SideRailItem[] = [
  { id: "recent-activity", label: "Recent activity", icon: LuClock3 },
  { id: "automation", label: "Automation", icon: LuNetwork },
  { id: "tasks", label: "Tasks", icon: LuSquareCheck },
  { id: "contact-details", label: "Contact details", icon: LuFileText, isActive: true },
  { id: "calendar", label: "Calendar", icon: LuCalendarDays },
];

export function getContactPageSectionDefinition(
  section: LayoutSection,
  data: ContactPageData,
  styles: ContactPageStyles,
  navigationHandlers: ContactNavigationHandlers,
) {
  const sectionRegistry: Record<KnownLayoutSectionType, ContactPageSectionDefinition> = {
    contactDetails: {
      className: classNames(styles.layoutColumn, styles.layoutColumnContact),
      render: (currentSection, pageData) =>
        createElement(ContactDetailsPanel, {
          title: currentSection.title,
          contact: pageData.contact,
          fieldsConfig: pageData.contactFields,
          recordPosition: pageData.contactIndex + 1,
          totalRecords: pageData.totalContacts,
          onPreviousContact: navigationHandlers.onPreviousContact,
          onNextContact: navigationHandlers.onNextContact,
        }),
    },
    conversations: {
      className: classNames(styles.layoutColumn, styles.layoutColumnConversations),
      render: (currentSection, pageData) =>
        createElement(ConversationsPanel, {
          title: currentSection.title,
          contactName: pageData.contact.firstName,
          conversations: pageData.conversations,
        }),
    },
    notes: {
      className: classNames(styles.layoutColumn, styles.layoutColumnNotes),
      render: (currentSection, pageData) =>
        createElement(NotesPanel, {
          title: currentSection.title,
          notes: pageData.notes,
        }),
    },
  };

  const definition = sectionRegistry[section.type as KnownLayoutSectionType];

  if (!definition) {
    return null;
  }

  return {
    className: definition.className,
    content: definition.render(section, data),
  };
}
