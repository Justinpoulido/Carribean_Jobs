import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://caribbeanjobs.com"),
  title: {
    default: "Caribbean Jobs | Find Jobs Across the Caribbean",
    template: "%s | Caribbean Jobs",
  },
  description:
    "Search jobs in Trinidad, Jamaica, Barbados, Guyana and across the Caribbean. Apply quickly or post a vacancy.",
  openGraph: {
    title: "Caribbean Jobs",
    description:
      "Your Future. Our Caribbean. One Opportunity at a Time.",
    type: "website",
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
