import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "StudyTrack — Study Smarter, Track Your Progress",
  description:
    "A modern student study tracker to manage study time, notes, tasks, goals, and academic progress.",
  keywords: [
    "study tracker",
    "student productivity",
    "pomodoro timer",
    "study streak",
    "academic progress",
    "revision tracker",
  ],
  authors: [{ name: "StudyTrack Team" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-study-bg text-study-darkText antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
