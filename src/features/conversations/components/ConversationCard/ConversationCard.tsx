import { LuEllipsisVertical, LuExternalLink, LuReply, LuStar } from "react-icons/lu";
import { Avatar, Button } from "../../../../shared/ui";
import { formatRelativeTime } from "../../../../shared/lib/dateFormatters";
import type { ConversationCardProps } from "../../types";
import styles from "./ConversationCard.module.css";

export default function ConversationCard({ item }: ConversationCardProps) {
  if (item.channel === "whatsapp") {
    return (
      <article className={styles.whatsappBubble}>
        <Avatar name={item.author} size="sm" />
        <div>
          <strong>{item.title}</strong>
          <p>{item.body}</p>
        </div>
      </article>
    );
  }

  return (
    <article className={styles.card}>
      <header className={styles.subject}>
        <h3>{item.title}</h3>
        <Button aria-label="Open conversation">
          <LuExternalLink size={17} />
        </Button>
      </header>
      <div className={styles.replyCount}>{item.replyCount}</div>
      <div className={styles.meta}>
        <Avatar name={item.author} size="md" />
        <div className={styles.sender}>
          <strong>{item.author}</strong>
          <span>To: {item.recipient}</span>
        </div>
        <span className={styles.time}>{formatRelativeTime(item.createdAt)}</span>
        {item.status === "starred" ? (
          <LuStar className={styles.star} size={18} aria-label="Starred" fill="currentColor" />
        ) : null}
        <Button aria-label="Reply">
          <LuReply size={17} />
        </Button>
        <Button aria-label="More options">
          <LuEllipsisVertical size={17} />
        </Button>
      </div>
      <p className={styles.body}>{item.body}</p>
      {item.actionLabel ? (
        <a className={styles.trackingLink} href="#conversation-action">
          {item.actionLabel}
        </a>
      ) : null}
      <button className={styles.replyButton} type="button">
        <LuReply size={17} /> Reply
      </button>
    </article>
  );
}
