import { useCallback, useEffect, useState } from "react";
import {
  LuChevronDown,
  LuMail,
  LuMessageCircle,
  LuReply,
  LuSend,
  LuSparkles,
} from "react-icons/lu";
import { getConversationPage } from "../../../../services/conversationService";
import { SectionCard } from "../../../../shared/ui";
import type { ConversationItem, ConversationsPanelProps } from "../../types";
import VirtualizedConversationList from "../VirtualizedConversationList/VirtualizedConversationList";
import styles from "./ConversationsPanel.module.css";

const CONVERSATION_PAGE_SIZE = 10;

export default function ConversationsPanel({ title, contactId, contactName }: ConversationsPanelProps) {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    setConversations([]);
    setPage(1);
    setHasMore(true);
    setError("");
    setIsLoadingInitial(true);

    getConversationPage(contactId, 1, CONVERSATION_PAGE_SIZE)
      .then((result) => {
        if (ignore) return;
        setConversations(result.items);
        setPage(result.page);
        setHasMore(result.hasMore);
      })
      .catch(() => {
        if (!ignore) setError("Unable to load conversations.");
      })
      .finally(() => {
        if (!ignore) setIsLoadingInitial(false);
      });

    return () => {
      ignore = true;
    };
  }, [contactId]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || isLoadingInitial || isLoadingMore) return;

    setIsLoadingMore(true);
    setError("");

    getConversationPage(contactId, page + 1, CONVERSATION_PAGE_SIZE)
      .then((result) => {
        setConversations((currentItems) => [...currentItems, ...result.items]);
        setPage(result.page);
        setHasMore(result.hasMore);
      })
      .catch(() => {
        setError("Unable to load conversations.");
      })
      .finally(() => {
        setIsLoadingMore(false);
      });
  }, [contactId, hasMore, isLoadingInitial, isLoadingMore, page]);

  return (
    <SectionCard
      title={
        <span className={styles.panelTitle}>
          <LuMessageCircle size={17} aria-hidden="true" />
          {title}
          <LuChevronDown size={16} aria-hidden="true" />
        </span>
      }
      className={styles.panel}
    >
      {isLoadingInitial || error ? (
        <div className={styles.feedState}>{error || "Loading conversations..."}</div>
      ) : (
        <VirtualizedConversationList
          conversations={conversations}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
        />
      )}
      <div className={styles.typingRow}>
        <LuReply size={15} aria-hidden="true" />
        {contactName} is typing
        <span className={styles.typingDots} aria-hidden="true">
          • • •
        </span>
      </div>
      <form className={styles.messageBox}>
        <button type="button" aria-label="Choose message channel">
          <LuMail size={18} />
        </button>
        <input placeholder="Type your message..." aria-label="Type your message" />
        <button type="button" aria-label="Use assistant">
          <LuSparkles size={18} />
        </button>
        <button type="submit" aria-label="Send message">
          <LuSend size={18} />
        </button>
      </form>
    </SectionCard>
  );
}
