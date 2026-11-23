export type SocialLink = {
  name: "Facebook" | "Instagram";
  /** Vul de URL van het account in. Zonder URL wordt het icoon niet getoond. */
  href: string;
};

export const socialLinks: SocialLink[] = [
  { name: "Facebook", href: "https://www.facebook.com/Soosactiviteiten/" },
  { name: "Instagram", href: "https://www.instagram.com/soos_in_kamperland/" },
];
