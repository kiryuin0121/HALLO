import { M_PLUS_Rounded_1c,DotGothic16, Orbitron } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import ModelPreLoader from "@/components/global/UI/ModelPreLoader";

export const metadata: Metadata = {
  title: "学内メタバース -HALLO-",
  description: "HAL生専用の学内メタバースです",
};
const mPlus = M_PLUS_Rounded_1c({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mplus"
});
const dotgothic = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dotgothic"
})
const orbitron = Orbitron({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-orbitron"
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${mPlus.variable} ${dotgothic.variable} ${orbitron.variable}`} suppressHydrationWarning>
      <ModelPreLoader/>
      <body className={`font-sans`}>{children}</body>
    </html>
  );
}
