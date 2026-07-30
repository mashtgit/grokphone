import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VoxHub — AI-Powered Voice Agents & Call Center Platform",
    template: "%s | VoxHub",
  },
  description:
    "VoxHub is a modern AI call center platform powered by Grok Voice AI. Deploy intelligent voice agents, automate customer calls, and transform your customer experience.",
  keywords: [
    "AI call center",
    "voice agents",
    "Grok Voice AI",
    "Voximplant",
    "voice AI platform",
    "automated calls",
    "AI phone assistant",
  ],
  openGraph: {
    title: "VoxHub — AI-Powered Voice Agents",
    description:
      "Deploy intelligent voice agents powered by Grok Voice AI. Transform your call center with AI.",
    type: "website",
    siteName: "VoxHub",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col bg-surface text-text font-sans antialiased">
        <ClientLayout>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
