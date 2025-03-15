import { ServiceWorkerRegistration } from "../app/components/ServiceWorkerRegistration";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import packageJson from "../../package.json"; // Import package.json

import { Toaster } from "react-hot-toast";

import ThemeToggle from "./components/ThemeToggle";
import ThemeProvider from "./components/ThemeProvider";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "fire-next-i ",
  description: "my portfolio app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-25L0KPBS0H"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-25L0KPBS0H');
      `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-[#191919] text-[#37352f] dark:text-[#ffffffcf]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>

            <Toaster />
            {/*       <footer className=" text-center py-4 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800">
              Version: {packageJson.version}
            </footer> */}
          </div>
        </ThemeProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
