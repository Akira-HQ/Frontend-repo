import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/AppContext";
import ToastContainer from "@/components/notifications/ToastContainer";
import PageTracker from "@/components/hooks/PageTracker";
import Footer from "@/components/Footer";
import BannerAlert from "@/components/notifications/AlertNotifications";
import NotificationContainer from "@/components/notifications/ToastContainer";
import { Header, ThemeProvider } from "@/components/Header";

export const metadata: Metadata = {
  title: "Cliva - Your Personal Sales Manager",
  description: "Cliva is an AI-powered sales management tool designed to help you track leads, manage customer relationships, and boost your sales performance with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`w-screen overflow-x-hidden relative antialiased`}>
        <AppProvider>
          <PageTracker />
          <ThemeProvider>
            <Header />

            {/* <BannerAlert /> */}
            <ToastContainer />
            {children}
            {/* <Footer /> */}
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
