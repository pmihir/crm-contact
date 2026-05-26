import { useEffect, useMemo, useState } from "react";
import { contactPageService } from "../../../../services/contactPageService";
import { classNames } from "../../../../shared/lib/classNames";
import { getContactPageSectionDefinition, sideRailItems } from "../../helpers/contactPageHelpers";
import type { ContactPageData, LayoutVariant } from "../../types";
import styles from "./ContactPage.module.css";

const layoutOptions: Array<{ label: string; value: LayoutVariant }> = [
  { label: "Default", value: "default" },
  { label: "Notes first", value: "notesFirst" },
];

export default function ContactPage() {
  const [data, setData] = useState<ContactPageData | null>(null);
  const [error, setError] = useState("");
  const [layoutVariant, setLayoutVariant] = useState<LayoutVariant>("default");

  useEffect(() => {
    let ignore = false;

    setError("");
    contactPageService
      .getContactPageData(layoutVariant)
      .then((pageData) => {
        if (!ignore) setData(pageData);
      })
      .catch(() => {
        if (!ignore) setError("We could not load the contact details. Please try again.");
      });

    return () => {
      ignore = true;
    };
  }, [layoutVariant]);

  const isLoading = !data && !error;

  const orderedSections = useMemo(() => {
    return [...(data?.layout.sections ?? [])].sort((a, b) => a.order - b.order);
  }, [data]);

  if (error) {
    return (
      <main className={classNames(styles.appShell, styles.appShellCentered)}>
        <div className={styles.stateCard}>
          <h1>Unable to load CRM page</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (isLoading || !data) {
    return (
      <main className={classNames(styles.appShell, styles.appShellCentered)}>
        <div className={styles.stateCard}>
          <div className={styles.loadingDot} />
          <p>Loading contact workspace...</p>
        </div>
      </main>
    );
  }

  const fullName = `${data.contact.firstName} ${data.contact.lastName}`;

  return (
    <main className={styles.appShell} aria-label={`CRM contact details for ${fullName}`}>
      <div className={styles.layoutToolbar} aria-label="Layout variant">
        <span>Layout</span>
        <div className={styles.layoutSwitch}>
          {layoutOptions.map((option) => (
            <button
              className={classNames(option.value === layoutVariant && styles.layoutSwitchActive)}
              key={option.value}
              type="button"
              onClick={() => setLayoutVariant(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.crmLayout}>
        {orderedSections.map((section) => {
          const sectionDefinition = getContactPageSectionDefinition(section, data, styles);

          if (!sectionDefinition) {
            return null;
          }

          return (
            <div className={sectionDefinition.className} key={section.id}>
              {sectionDefinition.content}
            </div>
          );
        })}
      </div>
      <nav className={styles.sideRail} aria-label="Workspace tools">
        {sideRailItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              className={item.isActive ? styles.sideRailActive : undefined}
              key={item.id}
              type="button"
              aria-label={item.label}
            >
              <Icon size={17} />
            </button>
          );
        })}
      </nav>
    </main>
  );
}
