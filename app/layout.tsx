import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BookmarkVault – Smart Bookmark Manager",
  description:
    "Save, organize, and access your bookmarks from anywhere. Private, real-time, and beautifully designed.",
  keywords: ["bookmarks", "bookmark manager", "save links", "organize links"],
  openGraph: {
    title: "BookmarkVault – Smart Bookmark Manager",
    description: "Save, organize, and access your bookmarks from anywhere.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
