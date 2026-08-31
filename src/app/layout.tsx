import type { Metadata } from "next";
import { Caveat, Geist_Mono, Nunito_Sans } from "next/font/google";

import { BoardBackdrop } from "@/components/layout/board-backdrop";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-heading",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TAST · Taiwanese Association of Students at Tufts",
    template: "%s · TAST",
  },
  description:
    "The Taiwanese Association of Students at Tufts (TAST). Events, community, and student life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunitoSans.variable} ${caveat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col">
        <BoardBackdrop />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
