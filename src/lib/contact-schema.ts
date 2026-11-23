export const contactSubjects = [
  "Algemene vraag",
  "Sponsor of vriend worden",
  "Een activiteit",
  "Anders",
] as const;

export type ContactField = "name" | "email" | "subject" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
  values?: Record<ContactField, string>;
};
