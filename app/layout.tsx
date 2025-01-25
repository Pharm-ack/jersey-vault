import "./globals.css";
import { connection } from "next/server";
import { Suspense } from "react";

import { GeistMono } from "geist/font/mono";
import { Metadata, Viewport } from "next";
import { CartProvider } from "@/components/cart/cart-context";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export const metadata: Metadata = {
  title: "Jersey Vault",
  description:
    "Jersey Vault is a store that sells jerseys and other clothing items.",
  authors: [{ name: "Jersey Vault" }],
  creator: "Pharmack",
  publisher: "pharmack",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

async function UTSSR() {
  await connection();

  return <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Suspense>
        <UTSSR />
      </Suspense>
      <body className={`${GeistMono.className} scroll-smooth`}>
        <SessionProvider>
          <CartProvider>
            <NextTopLoader showSpinner={false} />
            <Toaster />
            <div className="flex flex-col min-h-screen h-screen">
              {children}
            </div>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
