import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { AppProvider } from "@/components/AppContext";
import ToastContainer from "@/components/notifications/ToastContainer";
import PageTracker from "@/components/hooks/PageTracker";

export const metadata: Metadata = {
  title: "Akira AI",
  description: "Your online personal sales manager.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`w-screen overflow-x-hidden relative antialiased`}
      >
       <AppProvider>
        <PageTracker />
          <Header />
          <ToastContainer />
          {children}
       </AppProvider>
      </body>
    </html>
  );
}
