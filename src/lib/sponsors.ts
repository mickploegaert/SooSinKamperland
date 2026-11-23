/** De ranks voor "Vrienden van de Soos" op de sponsorpagina. */
export type FriendTier = {
  name: string;
  price: number;
  tone: "gold" | "silver" | "bronze";
};

export const friendTiers: FriendTier[] = [
  { name: "Gouden rank", price: 75, tone: "gold" },
  { name: "Zilveren rank", price: 50, tone: "silver" },
  { name: "Bronzen rank", price: 35, tone: "bronze" },
];
