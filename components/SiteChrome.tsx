"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Routes that should render without the global nav/footer (e.g. hidden,
// share-only pages). The page provides its own minimal chrome.
const BARE_ROUTES = ["/pre-call"];

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  );

  return (
    <>
      {!bare && <Navbar />}
      <main>{children}</main>
      {!bare && <Footer />}
    </>
  );
}
