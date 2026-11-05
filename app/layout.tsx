import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { Analytics } from "@vercel/analytics/next";
import GhlTracking from "@/components/GhlTracking";

export const metadata: Metadata = {
  title: "Sacramento AI Agency | AI Coaching, Assessments & Build Days",
  description:
    "AI Leverage Assessments, 1:1 AI coaching, team Build Days, and embedded AI leadership for Sacramento businesses and larger teams. Measured in hours you get back.",
  openGraph: {
    title: "Sacramento AI Agency | AI Coaching, Assessments & Build Days",
    description:
      "AI Leverage Assessments, 1:1 AI coaching, team Build Days, and embedded AI leadership, measured in hours you get back.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900;1,9..40,400&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
        <GhlTracking />
      </body>
    </html>
  );
}
