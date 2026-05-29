import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { VirtualizedConversationListProps } from "../../types";
import ConversationCard from "../ConversationCard/ConversationCard";
import styles from "./VirtualizedConversationList.module.css";

const PAGE_SIZE = 18;
const LOAD_MORE_DELAY_MS = 650;

export default function VirtualizedConversationList({ conversations }: VirtualizedConversationListProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const loadingTimerRef = useRef<number | undefined>(undefined);
  const [visibleCount, setVisibleCount] = useState(() => Math.min(PAGE_SIZE, conversations.length));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const visibleConversations = conversations.slice(0, visibleCount);
  const hasMore = visibleCount < conversations.length;

  const virtualizer = useVirtualizer({
    count: visibleConversations.length + (hasMore ? 1 : 0),
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: (index) => {
      const item = visibleConversations[index];
      if (!item) return 58;
      return item.channel === "whatsapp" ? 110 : 285;
    },
    getItemKey: (index) => visibleConversations[index]?.id ?? "loading-more",
    overscan: 3,
  });
  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = undefined;
    }

    setVisibleCount(Math.min(PAGE_SIZE, conversations.length));
    setIsLoadingMore(false);
    scrollContainerRef.current?.scrollTo({ top: 0 });
  }, [conversations]);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];

    if (
      !hasMore ||
      isLoadingMore ||
      loadingTimerRef.current ||
      !lastItem ||
      lastItem.index < visibleConversations.length
    ) {
      return;
    }

    setIsLoadingMore(true);
    loadingTimerRef.current = window.setTimeout(() => {
      setVisibleCount((currentCount) => Math.min(currentCount + PAGE_SIZE, conversations.length));
      setIsLoadingMore(false);
      loadingTimerRef.current = undefined;
    }, LOAD_MORE_DELAY_MS);
  }, [conversations.length, hasMore, isLoadingMore, visibleConversations.length, virtualItems]);

  return (
    <div className={styles.scrollArea} ref={scrollContainerRef}>
      <div className={styles.virtualCanvas} style={{ height: virtualizer.getTotalSize() }}>
        {virtualItems.map((virtualItem) => {
          const item = visibleConversations[virtualItem.index];

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
