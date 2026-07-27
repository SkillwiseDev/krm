import type { Metadata } from "next";
import FloaterBars from "@/components/FloaterBars";
import "./globals.css";

export const metadata: Metadata = {
  title: "KRM Healthcare | Complete Laboratory Solutions",
  description:
    "High-quality laboratory equipment, reagents, and complete pathology lab solutions at local prices.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <FloaterBars />
      </body>
    </html>
  );
}
