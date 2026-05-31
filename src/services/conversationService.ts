import conversationsFallback from "../data/conversations.json";
import type { ConversationItem, ConversationsPage } from "../features/conversations";
import { CONVERSATIONS_API_URL } from "./apiEndpoints";
import { getJson } from "./apiClient";

const conversationCache = new Map<string, ConversationsPage>();
const pendingConversationRequests = new Map<string, Promise<ConversationsPage>>();
const fallbackConversations = conversationsFallback as ConversationItem[];

function getCacheKey(contactId: string, page: number, limit: number) {
  return `${contactId}:${page}:${limit}`;
}

export async function getConversationPage(contactId: string, page: number, limit: number): Promise<ConversationsPage> {
  const cacheKey = getCacheKey(contactId, page, limit);

  if (conversationCache.has(cacheKey)) {
    return conversationCache.get(cacheKey)!;
  }

  if (pendingConversationRequests.has(cacheKey)) {
    return pendingConversationRequests.get(cacheKey)!;
  }

  const request = fetchConversationPage(contactId, page, limit)
    .then((result) => {
      conversationCache.set(cacheKey, result);
      return result;
    })
    .finally(() => {
      pendingConversationRequests.delete(cacheKey);
    });

  pendingConversationRequests.set(cacheKey, request);
  return request;
}

async function fetchConversationPage(contactId: string, page: number, limit: number): Promise<ConversationsPage> {
  try {
    const data = await getJson<unknown>(CONVERSATIONS_API_URL, {
      params: {
        contactId,
        page,
        limit,
      },
    });

    if (!Array.isArray(data)) {
      throw new Error("Conversations API returned an unexpected shape");
    }

    const items = data as ConversationItem[];

    return {
      items,
      hasMore: items.length === limit,
      page,
    };
  } catch (error) {
    console.warn("Falling back to local conversations JSON.", error);
    return getFallbackConversationPage(contactId, page, limit);
  }
}

function getFallbackConversationPage(contactId: string, page: number, limit: number): ConversationsPage {
  const start = (page - 1) * limit;
  const items = fallbackConversations.filter((conversation) => conversation.contactId === contactId).slice(start, start + limit);

  return {
    items,
    hasMore: items.length === limit,
    page,
  };
}

export function clearConversationCache() {
  conversationCache.clear();
  pendingConversationRequests.clear();
}
