export type ConversationChannel = "email" | "whatsapp" | "call" | "sms";

export type ConversationItem = {
  id: string;
  contactId: string;
  channel: ConversationChannel;
  title: string;
  author: string;
  recipient: string;
  createdAt: string;
  body: string;
  actionLabel?: string;
  status?: "starred" | "incoming" | "open";
  replyCount?: number;
};

export type ConversationsPanelProps = {
  title: string;
  contactId: string;
  contactName: string;
};

export type ConversationCardProps = {
  item: ConversationItem;
};

export type VirtualizedConversationListProps = {
  conversations: ConversationItem[];
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
};

export type ConversationsPage = {
  items: ConversationItem[];
  hasMore: boolean;
  page: number;
};
