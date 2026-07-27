import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  title: "Job Hunt Engine",
  description: "End-to-end job hunting preparation platform. Manage career gems, tailor resumes, and prepare for interviews.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Job Hunt Engine",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-dvh bg-background antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
