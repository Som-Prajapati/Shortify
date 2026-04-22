import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Providers from "./providers";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shortify - Fast URL Shortener & QR Generator",
  description:
    "Create short links and QR codes with custom domains. Fast, customizable, and built for professionals.",
  generator: "v0.app",
  verification: {
    google: "TQIZl_FQrwR8LH3BEJPSDI1HpAZutUFsnQdw4d6wRFk",
  },
  icons: {
    icon: [
      {
        url: "/shortifylogo.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/shortifylogo-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/shortifylogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
