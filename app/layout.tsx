"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { persistor, store } from "@/store";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { PersistGate } from "redux-persist/integration/react";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import SocketListener from "@/lib/SocketListener";
import FloatingChatWidget from "@/components/FloatingChatWidget";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense — loads after page is interactive to avoid blocking render */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3220405841079438"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ReactQueryProvider>
              <SocketListener />
              <FloatingChatWidget />
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </ReactQueryProvider>
            <Toaster position="top-right" />
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
