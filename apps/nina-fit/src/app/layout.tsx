import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import fs from "node:fs";
import path from "node:path";
import { SharedNavigation } from "@nina/ui-components";
import { AuthProvider } from "../components/providers/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nina Fit",
  description: "Your AI Fitness Companion",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nina Fit",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let version = "0.0.0";
  try {
    version = fs
      .readFileSync(path.join(process.cwd(), "version.txt"), "utf-8")
      .trim();
  } catch (e) {
    console.warn("Could not read version.txt", e);
  }

  const navItems = [
    { label: "Home", href: "/" },
    { label: "History", href: "/history" },
  ];

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SharedNavigation
            items={navItems}
            version={version}
            logo={<span className="font-bold text-lg">Nina Fit</span>}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
