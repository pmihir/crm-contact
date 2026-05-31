import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { VirtualizedConversationListProps } from "../../types";
import ConversationCard from "../ConversationCard/ConversationCard";
import styles from "./VirtualizedConversationList.module.css";

export default function VirtualizedConversationList({
  conversations,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: VirtualizedConversationListProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const virtualizer = useVirtualizer({
    count: conversations.length + (hasMore ? 1 : 0),
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: (index) => {
      const item = conversations[index];
      if (!item) return 56;
      return item.channel === "whatsapp" ? 110 : 285;
    },
    getItemKey: (index) => conversations[index]?.id ?? "load-more-conversations",
    overscan: 3,
  });
  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!hasMore || isLoadingMore || !lastItem || lastItem.index < conversations.length) {
      return;
    }

    onLoadMore();
  }, [conversations.length, hasMore, isLoadingMore, onLoadMore, virtualItems]);

  return (
    <div className={styles.scrollArea} ref={scrollContainerRef}>
      <div className={styles.virtualCanvas} style={{ height: virtualizer.getTotalSize() }}>
        {virtualItems.map((virtualItem) => {
          const item = conversations[virtualItem.index];

          return (
            <div
              className={styles.virtualRow}
              data-index={virtualItem.index}
              key={virtualItem.key}
              ref={virtualizer.measureElement}
              style={{ transform: `translateY(${virtualItem.start}px)` }}
            >
              {item ? <ConversationCard item={item} /> : <div className={styles.loader}>Loading more conversations...</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
