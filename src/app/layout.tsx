import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { NextAuthProvider, AuthSync } from "@/components/portal/session-provider";
import { MentorChatWidget } from "@/components/portal/mentor-chat-widget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgilePortal Enterprise - Industry-Grade Internships + Enterprise L&D",
  description:
    "AgilePortal Enterprise delivers mentor-led, project-based internship programs for MBA, BBA and BSc students, plus enterprise organization & team management for corporate L&D cohorts. UGC & AICTE-aligned, verifiable certificates, 100% online.",
  keywords: [
    "MBA Internship",
    "BBA Internship",
    "BSc Internship",
    "Internship for Management Students",
    "Industry Projects",
    "AgilePortal Enterprise",
    "Enterprise L&D",
    "Organization Management",
    "Live Mentor-Led Internship",
    "Verifiable Certificate",
  ],
  authors: [{ name: "AgilePortal Enterprise" }],
  openGraph: {
    title: "AgilePortal Enterprise - Industry-Grade Internships + Enterprise L&D",
    description:
      "Mentor-led, project-based internship programs for MBA, BBA and BSc students + enterprise org & team management. UGC-aligned certificates, 100% online.",
    siteName: "AgilePortal Enterprise",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgilePortal Enterprise - Internships + Enterprise L&D",
    description: "Industry-grade, mentor-led internships with verifiable certificates + enterprise org management.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <NextAuthProvider>
          {children}
          <AuthSync />
          <MentorChatWidget />
        </NextAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
