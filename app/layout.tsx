import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Capps AI — AI Consulting for Small Businesses",
  description:
    "We show small businesses exactly where AI can save them time and money — and we prove the ROI. Start with a free 5-minute assessment.",
  openGraph: {
    title: "Capps AI — AI Consulting for Small Businesses",
    description:
      "We show small businesses exactly where AI can save them time and money — and we prove the ROI.",
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
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
