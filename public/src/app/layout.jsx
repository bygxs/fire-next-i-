import { ServiceWorkerRegistration } from "../app/components/ServiceWorkerRegistration";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "./components/ThemeProvider";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";
import { NotificationPermissionButton } from "./components/Notification";
import { Notification } from "./components/Notification";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});
export const metadata = {
    title: "fire-next-i ",
    description: "my portfolio app",
};
export default function RootLayout({ children, }) {
    return (<html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json"/>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-25L0KPBS0H"></script>
        <script dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-25L0KPBS0H');
      `,
        }}/>
      </head>
      <body className="bg-white dark:bg-[#191919] text-[#37352f] dark:text-[#ffffffcf]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>

            <Toaster />
          </div>
        </ThemeProvider>
        <ServiceWorkerRegistration />
        {/* Add this at the end of your body */}
        <Notification />

        {/* Add this wherever you want the permission button to appear */}
        <div className="fixed bottom-4 right-4">
          <NotificationPermissionButton />
        </div>
      </body>
    </html>);
}
