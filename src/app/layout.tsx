import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Self-hosted variable fonts (SIL OFL 1.1 — see src/fonts/).
 * Local files keep the build free of network calls and stop the browser
 * making a third-party request on every visit.
 */
const inter = localFont({
  src: "../fonts/inter-variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
});

const spaceGrotesk = localFont({
  src: "../fonts/space-grotesk-variable.woff2",
  weight: "300 700",
  style: "normal",
  variable: "--font-space-grotesk",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://carribeanjobs.online"),
  title: {
    default: "Caribbean Jobs | Find Jobs Across the Caribbean",
    template: "%s | Caribbean Jobs",
  },
  description:
    "Search jobs in Trinidad, Jamaica, Barbados, Guyana and across the Caribbean. Apply quickly or post a vacancy.",
  openGraph: {
    title: "Caribbean Jobs",
    description: "Your Future. Our Caribbean. One Opportunity at a Time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-full bg-cream text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ocean focus:px-5 focus:py-3 focus:font-bold focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
