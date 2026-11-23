import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "Soos in Kamperland",
    template: "%s | Soos in Kamperland",
  },
  description: "Website van Soos in Kamperland.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl" className={`${poppins.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-soos-ink antialiased">
        {children}
      </body>
    </html>
  );
}
