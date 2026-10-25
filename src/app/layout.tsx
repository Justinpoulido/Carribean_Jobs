import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Find Jobs Across the Caribbean`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Search jobs in Trinidad, Jamaica, Barbados, Guyana and across the Caribbean. Apply directly to employers or post a vacancy.",
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_TAGLINE,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-white text-slate-900">{children}</body>
    </html>
  );
}
