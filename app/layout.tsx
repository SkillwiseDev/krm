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
  verification: {
    google: "vpMc5qkYBEVpfGixQKj_e6LC3Zw4UHyn43BH2OTXd-M",
    other: {
      "msvalidate.01": "2124454593C30957543F5ABD6323B4AA",
    },
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