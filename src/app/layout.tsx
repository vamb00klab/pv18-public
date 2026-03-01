import type { Metadata } from "next";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";
import FeedbackButton from "@/components/FeedbackButton";

const displayName = process.env.NEXT_PUBLIC_DISPLAY_NAME ?? "PersonaVOLT18";
const tagline =
  process.env.NEXT_PUBLIC_TAGLINE ?? "キミの中に眠る「タイプ」を見つけよう";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

/**
 * Site-wide metadata.
 * og:image is intentionally omitted until an actual share image asset exists.
 * Add it as: openGraph: { images: [{ url: "/og.png", width: 1200, height: 630 }] }
 */
export const metadata: Metadata = {
  title: {
    default: displayName,
    template: `%s | ${displayName}`,
  },
  description: tagline,
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    siteName: displayName,
    title: displayName,
    description: tagline,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: displayName,
    description: tagline,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased flex flex-col min-h-screen">
          {children}
          <SiteFooter />
          <FeedbackButton />
        </body>
    </html>
  );
}
