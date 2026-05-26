import layout from "../data/layout.json";
import contactFields from "../data/contactFields.json";
import contactData from "../data/contactData.json";
import notes from "../data/notes.json";
import conversations from "../data/conversations.json";
import type { ContactData, ContactFieldsConfig } from "../features/contact-details";
import type { ConversationItem } from "../features/conversations";
import type { Note } from "../features/notes";
import type { ContactPageData, ContactPageResourceMap, ContactPageService, LayoutConfig, LayoutVariant } from "../pages/contact-page/types";

const resources: ContactPageResourceMap = {
  layout: layout as LayoutConfig,
  contactFields: contactFields as ContactFieldsConfig,
  contact: contactData as ContactData,
  notes: notes as Note[],
  conversations: conversations as ConversationItem[],
};

const cache = new Map<keyof ContactPageResourceMap, ContactPageResourceMap[keyof ContactPageResourceMap]>();

const layoutOrderOverrides: Record<LayoutVariant, Partial<Record<string, number>>> = {
  default: {},
  notesFirst: {
    notes: 1,
    "contact-details": 2,
    conversations: 3,
  },
};

function delay(ms: number) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms));
}

async function fetchResource<K extends keyof ContactPageResourceMap>(key: K): Promise<ContactPageResourceMap[K]> {
  if (cache.has(key)) {
    return cache.get(key) as ContactPageResourceMap[K];
  }

  await delay(180);
  const value = resources[key];
  cache.set(key, value);
  return value;
}

function applyLayoutVariant(layoutConfig: LayoutConfig, layoutVariant: LayoutVariant): LayoutConfig {
  const orderOverrides = layoutOrderOverrides[layoutVariant];

  return {
    sections: layoutConfig.sections.map((section) => ({
      ...section,
      order: orderOverrides[section.id] ?? section.order,
    })),
  };
}

async function getContactPageData(layoutVariant: LayoutVariant = "default"): Promise<ContactPageData> {
  const [layoutConfig, fieldsConfig, contact, notesList, conversationList] = await Promise.all([
    fetchResource("layout"),
    fetchResource("contactFields"),
    fetchResource("contact"),
    fetchResource("notes"),
    fetchResource("conversations"),
  ]);

  return {
    layout: applyLayoutVariant(layoutConfig, layoutVariant),
    contactFields: fieldsConfig,
    contact,
    notes: notesList,
    conversations: conversationList,
  };
}

function clearCache() {
  cache.clear();
}

export const contactPageService: ContactPageService = {
  getContactPageData,
  clearCache,
};
