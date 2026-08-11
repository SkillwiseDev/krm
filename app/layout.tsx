import type { Metadata } from "next";
import FloaterBars from "@/components/FloaterBars";
import "./globals.css";
import Script from "next/script";

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
         <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WNG5JH2B16"
          strategy="afterInteractive"
        />

        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WNG5JH2B16');
          `}
        </Script>
      </body>
    </html>
  );
}
