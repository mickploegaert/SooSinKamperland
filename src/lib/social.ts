export type SocialLink = {
  name: "Facebook" | "Instagram";
  /** Vul de URL van het account in. Zonder URL wordt het icoon niet getoond. */
  href: string;
};

export const socialLinks: SocialLink[] = [
  { name: "Facebook", href: "" },
  { name: "Instagram", href: "" },
];
