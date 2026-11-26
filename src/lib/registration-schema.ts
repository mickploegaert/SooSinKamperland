export type RegistrationField = "activity" | "name" | "email" | "people" | "note";

export type RegistrationState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<RegistrationField, string>>;
  values?: Record<RegistrationField, string>;
};
