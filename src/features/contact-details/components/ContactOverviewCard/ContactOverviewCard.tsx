import { LuChevronDown, LuPhone, LuPlus } from "react-icons/lu";
import { Avatar, Button, Tag } from "../../../../shared/ui";
import type { ContactOverviewCardProps } from "../../types";
import styles from "./ContactOverviewCard.module.css";

export default function ContactOverviewCard({ contact }: ContactOverviewCardProps) {
  const fullName = `${contact.firstName} ${contact.lastName}`;

  return (
    <section className={styles.profileCard}>
      <div className={styles.profileMain}>
        <Avatar name={fullName} imageUrl={contact.avatarUrl} size="lg" />
        <strong>{fullName}</strong>
        <Button variant="icon" tone="success" aria-label="Call contact">
          <LuPhone size={19} />
        </Button>
      </div>

      <div className={styles.profileMeta}>
        <div>
          <span>Owner</span>
          <button className={styles.personPill} type="button">
            <Avatar name={contact.owner} size="sm" />
            {contact.owner}
            <LuChevronDown size={14} aria-hidden="true" />
          </button>
        </div>
        <div>
          <span>Followers</span>
          <button className={styles.personPill} type="button">
            <span className={styles.followerStack}>
              {contact.followers.slice(0, 2).map((name) => (
                <Avatar key={name} name={name} size="sm" />
              ))}
            </span>
            <LuChevronDown size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={styles.profileTags}>
        <span>Tags</span>
        <div className={styles.tagList}>
          {contact.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          <Button variant="smallAdd" aria-label="Add tag">
            <LuPlus size={15} />
          </Button>
        </div>
      </div>
    </section>
  );
}
