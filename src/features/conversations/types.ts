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
  contactName: string;
  conversations: ConversationItem[];
};

export type ConversationCardProps = {
  item: ConversationItem;
};
