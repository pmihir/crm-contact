export function formatRelativeTime(date: string, now = Date.now()) {
  const minutes = Math.max(1, Math.round((now - new Date(date).getTime()) / 60000));

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.round(minutes / 60);
  return `${hours} hour${hours > 1 ? "s" : ""} ago`;
}

export function formatShortDate(date: string, locale = "en") {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
