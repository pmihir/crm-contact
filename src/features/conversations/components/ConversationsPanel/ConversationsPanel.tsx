import {
  LuChevronDown,
  LuMail,
  LuMessageCircle,
  LuReply,
  LuSend,
  LuSparkles,
} from "react-icons/lu";
import { SectionCard } from "../../../../shared/ui";
import type { ConversationsPanelProps } from "../../types";
import VirtualizedConversationList from "../VirtualizedConversationList/VirtualizedConversationList";
import styles from "./ConversationsPanel.module.css";

export default function ConversationsPanel({ title, contactName, conversations }: ConversationsPanelProps) {
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
      <VirtualizedConversationList conversations={conversations} />
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
