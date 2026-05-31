import layout from "../data/layout.json";
import contactFields from "../data/contactFields.json";
import contactData from "../data/contactData.json";
import notes from "../data/notes.json";
import type { ContactData, ContactFieldsConfig } from "../features/contact-details";
import type { Note } from "../features/notes";
import type { ContactPageData, ContactPageResourceMap, ContactPageService, LayoutConfig, LayoutVariant } from "../pages/contact-page/types";
import { CONTACT_FIELDS_API_URL, CONTACTS_API_URL, LAYOUT_API_URL, NOTES_API_URL } from "./apiEndpoints";
import { getJson } from "./apiClient";

const API_ENDPOINTS = {
  layout: LAYOUT_API_URL,
  contactFields: CONTACT_FIELDS_API_URL,
  contacts: CONTACTS_API_URL,
  notes: NOTES_API_URL,
};

const resources: ContactPageResourceMap = {
  layout: layout as LayoutConfig,
  contactFields: contactFields as ContactFieldsConfig,
  contacts: contactData as ContactData[],
  notes: notes as Note[],
};

const cache = new Map<keyof ContactPageResourceMap, ContactPageResourceMap[keyof ContactPageResourceMap]>();
const pendingRequests = new Map<keyof ContactPageResourceMap, Promise<ContactPageResourceMap[keyof ContactPageResourceMap]>>();

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

async function fetchResource(key: "layout"): Promise<LayoutConfig>;
async function fetchResource<K extends Exclude<keyof ContactPageResourceMap, "layout">>(
  key: K,
): Promise<ContactPageResourceMap[K]>;
async function fetchResource(
  key: keyof ContactPageResourceMap,
): Promise<ContactPageResourceMap[keyof ContactPageResourceMap]> {
  if (cache.has(key)) {
    return cache.get(key) as ContactPageResourceMap[keyof ContactPageResourceMap];
  }

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<ContactPageResourceMap[keyof ContactPageResourceMap]>;
  }

  const request = delay(180)
    .then(() => fetchRemoteResource(key))
    .then((value) => {
      cache.set(key, value);
      return value;
    })
    .finally(() => {
      pendingRequests.delete(key);
    });

  pendingRequests.set(key, request);
  return request;
}

async function fetchRemoteResource<K extends keyof ContactPageResourceMap>(key: K): Promise<ContactPageResourceMap[K]> {
  try {
    const data = await getJson<unknown>(API_ENDPOINTS[key]);

    if (!isValidResource(key, data)) {
      throw new Error(`${key} API returned an unexpected shape`);
    }

    return data as ContactPageResourceMap[K];
  } catch (error) {
    console.warn(`Falling back to local ${key} JSON.`, error);
    return resources[key];
  }
}

function isValidResource(key: keyof ContactPageResourceMap, data: unknown) {
  if (key === "layout") return isObject(data) && Array.isArray((data as LayoutConfig).sections);
  if (key === "contactFields") return isObject(data) && Array.isArray((data as ContactFieldsConfig).folders);
  return Array.isArray(data);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
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

function getSafeContactIndex(contactIndex: number, totalContacts: number) {
  return Math.min(Math.max(contactIndex, 0), Math.max(totalContacts - 1, 0));
}

async function getContactPageData(layoutVariant: LayoutVariant = "default", contactIndex = 0): Promise<ContactPageData> {
  const [layoutConfig, fieldsConfig, contacts, notesList] = await Promise.all([
    fetchResource("layout"),
    fetchResource("contactFields"),
    fetchResource("contacts"),
    fetchResource("notes"),
  ]);
  const safeContactIndex = getSafeContactIndex(contactIndex, contacts.length);
  const contact = contacts[safeContactIndex];

  return {
    layout: applyLayoutVariant(layoutConfig, layoutVariant),
    contactFields: fieldsConfig,
    contact,
    contactIndex: safeContactIndex,
    totalContacts: contacts.length,
    notes: notesList.filter((note) => note.contactId === contact.id),
  };
}

function clearCache() {
  cache.clear();
  pendingRequests.clear();
}

export const contactPageService: ContactPageService = {
  getContactPageData,
  clearCache,
};
