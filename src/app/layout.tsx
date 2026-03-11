import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

const metaDataDesctiption = "Film, TV & Sync composer. Indie, electronic, neoclassical and ambient — Edinburgh, UK."

export const metadata: Metadata = {
  title: "Oliver Lyu",
  description: metaDataDesctiption,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Oliver Lyu",
    description: metaDataDesctiption,
    url: "https://oliverkeenanlyu.music",
    images: [{ url: "/oliver-studio-1.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/oliver-studio-1.jpg"],
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
