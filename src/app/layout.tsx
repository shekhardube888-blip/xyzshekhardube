import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgilePortal - Industry-Grade Internships for MBA, BBA & BSc Students",
  description:
    "AgilePortal delivers mentor-led, project-based internship programs for MBA, BBA and BSc students across India. UGC & AICTE-aligned, verifiable certificates, 100% online.",
  keywords: [
    "MBA Internship",
    "BBA Internship",
    "BSc Internship",
    "Internship for Management Students",
    "Industry Projects",
    "AgilePortal",
    "Live Mentor-Led Internship",
    "Verifiable Certificate",
  ],
  authors: [{ name: "AgilePortal" }],
  openGraph: {
    title: "AgilePortal - Industry-Grade Internships for MBA, BBA & BSc Students",
    description:
      "Mentor-led, project-based internship programs for MBA, BBA and BSc students. UGC-aligned certificates, 100% online, completely free.",
    siteName: "AgilePortal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgilePortal - Internships for MBA, BBA & BSc",
    description: "Industry-grade, mentor-led internships with verifiable certificates.",
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
