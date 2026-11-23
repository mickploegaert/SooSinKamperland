export type SocialLink = {
  name: "Facebook" | "Instagram";
  /** Naam zoals bezoekers die kennen, bijvoorbeeld @gebruikersnaam. */
  handle: string;
  /** Vul de URL van het account in. Zonder URL wordt het icoon niet getoond. */
  href: string;
};

export const socialLinks: SocialLink[] = [
  { name: "Facebook", handle: "Soosactiviteiten", href: "https://www.facebook.com/Soosactiviteiten/" },
  { name: "Instagram", handle: "@soos_in_kamperland", href: "https://www.instagram.com/soos_in_kamperland/" },
];
