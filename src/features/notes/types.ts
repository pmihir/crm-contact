export type NotePriority = "high" | "normal" | "low";

export type Note = {
  id: string;
  contactId: string;
  content: string;
  createdAt: string;
  author: string;
  type?: string;
  priority?: NotePriority;
};

export type NotesPanelProps = {
  title: string;
  notes: Note[];
};
