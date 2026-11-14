import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CookieConsent } from "@/components/ui/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://study-track-drab.vercel.app"),
  title: "StudyTrack — Study Smarter, Track Your Progress",
  description:
    "An advanced academic productivity platform for competitive exam aspirants. Track study hours, master spaced-repetition topics, and generate authenticated single-page certificates.",
  keywords: [
    "study tracker",
    "student productivity",
    "pomodoro timer",
    "study streak",
    "academic progress",
    "revision tracker",
    "study report card",
    "certificate verification",
    "SSC CGL preparation",
    "spaced repetition",
  ],
  authors: [{ name: "Chandan Ghanghav" }, { name: "StudyTrack Team" }],
  creator: "Chandan Ghanghav",
  publisher: "StudyTrack Platform",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "StudyTrack — Study Smarter, Track Your Progress",
    description:
      "Empowering competitive exam aspirants with certified study tracking, spaced-repetition schedules, and authentic educational ledgers.",
    url: "https://study-track-drab.vercel.app",
    siteName: "StudyTrack",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyTrack — Study Smarter, Track Your Progress",
    description:
      "A modern student study tracker with verified single-page certificates and spaced-repetition analytics.",
    creator: "@trigger_toofan",
  },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "StudyTrack",
  url: "https://study-track-drab.vercel.app",
  logo: "https://study-track-drab.vercel.app/icon.png",
  description:
    "StudyTrack is a verified educational productivity platform for competitive exam aspirants and university students.",
  founder: {
    "@type": "Person",
    name: "Chandan Ghanghav",
    url: "https://www.instagram.com/trigger_toofan",
  },
  sameAs: ["https://www.instagram.com/trigger_toofan"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  return (
    <html lang="en">
      <head>
        {/* Support for Google AdSense automatic verification meta tag */}
        {adsenseId && (
          <meta name="google-adsense-account" content={adsenseId} />
        )}

        {/* Support for Google AdSense official script tag */}
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}

        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-study-bg text-study-darkText antialiased`}>
        <AuthProvider>
          {children}
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
